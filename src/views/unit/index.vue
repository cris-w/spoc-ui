<template>
  <div class="app-container">
    <!-- 筛选款 & 添加按钮 -->
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText"
      style="width: 200px; margin-right: 20px"
    />
    <el-button type="primary" round class="addBtn" @click="openDialog"
      >添加单元</el-button
    >
    <el-button type="primary" round class="addBtn" @click="toMyClass"
      >返回我的小组</el-button
    >

    <!-- 树形结构 -->
    <el-tree
      ref="unitTree"
      node-key="id"
      :data="list"
      :props="defaultProps"
      default-expand-all
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      style="margin-top: 20px"
    >
      <span class="custom-tree-node" slot-scope="{ data }">
        <span>{{ data.name }}</span>
        <span>
          <el-button
            v-if="data.children"
            type="text"
            size="mini"
            @click="handleAdd(data.id)"
          >
            添加小节
          </el-button>
          <el-button type="text" size="mini" @click="() => handleUpdate(data)">
            编辑
          </el-button>
          <el-button type="text" size="mini" @click="() => handleDelete(data)">
            删除节点
          </el-button>
        </span>
      </span>
    </el-tree>

    <!-- 单元 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="unitDialogFormVisible"
    >
      <el-form
        ref="unitForm"
        :rules="unitRules"
        :model="unit"
        label-position="right"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="单元名" prop="name">
          <el-input v-model="unit.name" />
        </el-form-item>
        <el-form-item label="序号" prop="order">
          <el-input-number
            :min="0"
            v-model="unit.order"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="unitDialogFormVisible = false"> 返回 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createUnit() : updateUnit()"
        >
          提交
        </el-button>
      </div>
    </el-dialog>

    <!-- Video dialog -->
    <el-dialog :visible.sync="videoDialogFormVisible" title="课时">
      <el-form :model="video" ref="dataForm" :rules="videoRules">
        <el-form-item label="课时名" label-width="120px" prop="name">
          <el-input v-model="video.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="序号" label-width="120px" prop="order">
          <el-input-number
            :min="0"
            v-model="video.order"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="视频" label-width="120px">
          <!-- <a :href="video.videoSource" target="_blank">点击查看视频</a> -->
          <el-link
            :href="video.url"
            target="_blank"
            :underline="false"
            v-if="video.originalName"
            >点击查看<i class="el-icon-view el-icon--right"></i>
          </el-link>
          <i
            v-if="video.originalName"
            class="el-icon-delete"
            style="margin-left: 70px"
            @click="handleVodRemove"
          ></i>
          <el-upload
            :action="BASE_API + '/oos/fileOos/uploadVideo'"
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :limit="1"
            v-show="video.show"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传MP4文件，且不超过500MB
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="videoDialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createVideo() : updateVideo()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUnit,
  getUnitById,
  addUnit,
  update,
  deleteById,
  getVideoById,
  addVideo,
  updateVideo,
  deleteVideoById,
  deleteVideo,
} from "@/api/unit";
export default {
  name: "Unit",
  watch: {
    filterText(val) {
      this.$refs.unitTree.filter(val);
    },
  },
  data() {
    return {
      list: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      filterText: "",
      dialogStatus: "",
      BASE_API: process.env.VUE_APP_BASE_API,
      textMap: {
        update: "编辑",
        create: "添加",
      },
      unit: {
        name: "",
        order: "",
      },
      video: {
        unitId: undefined,
        name: "",
        order: 0,
        url: "",
        originalName: "",
      },
      fileList: [],
      classroomId: undefined,
      unitRules: {
        name: [{ required: true, message: "请输入章节名", trigger: "blur" }],
        order: [{ required: true, message: "请选择序号", trigger: "blur" }],
      },
      videoRules: {
        name: [{ required: true, message: "请输入小节名", trigger: "blur" }],
        order: [{ required: true, message: "请选择序号", trigger: "blur" }],
      },
      unitDialogFormVisible: false,
      videoDialogFormVisible: false,
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.classroomId = this.$route.params.id;
      this.getList();
    }
  },
  methods: {
    // 过滤树节点
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    resetUnit() {
      this.unit = {
        name: "",
        order: 0,
      };
    },
    resetVideo() {
      this.video = {
        unitId: undefined,
        name: "",
        order: 0,
        url: "",
        originalName: "",
        show: true,
      };
      this.fileList = [];
    },
    getList() {
      listUnit(this.classroomId).then((res) => {
        if (res) {
          this.list = res.data;
        }
      });
    },
    toMyClass() {
      this.$router.push({ path: `/group/member` });
    },
    // ================== unit ==================
    // 添加父节点
    openDialog() {
      this.resetUnit();
      this.dialogStatus = "create";
      this.unitDialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["unitForm"].clearValidate();
      });
    },
    createUnit() {
      this.$refs["unitForm"].validate((valid) => {
        if (valid) {
          this.unit.classroomId = this.classroomId;
          addUnit(this.unit).then((res) => {
            if (res) {
              this.unitDialogFormVisible = false;
              this.getList();
              this.$message.success("添加成功");
            }
          });
        }
      });
    },
    updateUnit() {
      update(this.unit).then((res) => {
        if (res) {
          this.$message.success("修改单元成功");
          this.unitDialogFormVisible = false;
          this.getList();
        }
      });
    },
    // ================== video ==================
    // 添加子节点
    handleAdd(id) {
      this.resetVideo();
      this.video.unitId = id;
      this.dialogStatus = "create";
      this.videoDialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createVideo() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.video.classroomId = this.classroomId;
          addVideo(this.video).then((res) => {
            if (res) {
              this.videoDialogFormVisible = false;
              this.getList();
              this.$message.success("创建小节成功");
            }
          });
        }
      });
    },
    updateVideo() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          console.log(this.video);
          updateVideo(this.video).then((res) => {
            if (res) {
              this.videoDialogFormVisible = false;
              this.getList();
              this.$message.success("修改小节成功");
            }
          });
        }
      });
    },
    handleVodUploadSuccess(response, file, fileList) {
      this.video.url = response.data.url;
      this.video.originalName = response.data.originalName;
    },
    beforeVodRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleVodRemove() {
      deleteVideo(this.video.originalName).then((res) => {
        this.$message.success("删除视频成功^-^");
        // 清空视屏地址 以及 名称
        this.video.url = "";
        this.video.originalName = "";
        // 清空视屏列表
        this.fileList = [];
        // 显示上传组件
        this.video.show = true;
      });
    },
    handleUploadExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    // ================== unit & video ==================
    handleUpdate(data) {
      this.dialogStatus = "update";
      // 通过是否有 children 判断为单元 or 小节
      if (data.children) {
        // 单元
        getUnitById(data.id).then((res) => {
          if (res) {
            this.unit = res.data;
            this.unitDialogFormVisible = true;
          }
        });
      } else {
        // 小节
        getVideoById(data.id).then((res) => {
          if (res) {
            this.video = res.data;
            if (this.video.originalName) {
              this.video.show = false;
            } else {
              this.video.show = true;
            }
            this.videoDialogFormVisible = true;
          }
        });
      }
    },
    handleDelete(data) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (data.children) {
            // 章节
            if (data.children.length > 0) {
              this.$message.warning("请先删除子节点");
            } else {
              deleteById(data.id).then((res) => {
                if (res) {
                  this.getList();
                  this.$message.success("删除成功");
                }
              });
            }
          } else {
            // 小节
            deleteVideoById(data.id).then((res) => {
              if (res) {
                this.getList();
                this.$message.success("删除成功");
              }
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style >
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>