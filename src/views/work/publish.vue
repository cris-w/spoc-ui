<template>
  <div class="app-container">
    <el-card style="width: 70%">
      <el-form ref="form" :rules="rules" :model="work" label-width="80px">
        <el-form-item label="作业名称" prop="name">
          <el-input v-model="work.name" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="选择小组" prop="classroomId">
          <el-select v-model="work.classroomId" placeholder="请选择发布班级">
            <el-option
              v-for="item in clazz"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件">
          <el-link :href="work.url" :underline="false" v-if="work.originalName"
            >点击下载<i class="el-icon-download el-icon--right"></i>
          </el-link>
          <i
            v-if="work.originalName"
            class="el-icon-delete"
            style="margin-left: 70px"
            @click="handleVodRemove"
          ></i>
          <el-upload
            class="upload-demo"
            drag
            :action="BASE_API + '/oos/fileOos/uploadVideo'"
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :limit="1"
            v-show="work.originalName.length == 0"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="截止时间" prop="deadline">
          <el-date-picker
            v-model="work.deadline"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="作业描述">
          <el-input
            type="textarea"
            style="width: 50%"
            v-model="work.desc"
            :rows="3"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createWork">确定</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { deleteVideo } from "@/api/unit";
import { listByTeacherId } from "@/api/classroom";
import { addWork, getWorkById, update } from "@/api/twork";
import { mapGetters } from "vuex";
export default {
  name: "WorkPublish",
  computed: {
    ...mapGetters(["id"]),
  },
  data() {
    return {
      work: {
        name: "",
        classroomId: undefined,
        url: "",
        originalName: "",
        deadline: "",
        desc: "",
        userId: undefined,
      },
      rules: {
        name: [{ required: true, message: "请选择发布班级", trigger: "blur" }],
        classroomId: [
          { required: true, message: "请选择发布班级", trigger: "change" },
        ],
        deadline: [
          {
            required: true,
            message: "请选择截止日期",
            trigger: "change",
          },
        ],
      },
      clazz: [],
      BASE_API: process.env.VUE_APP_BASE_API,
      fileList: [],
    };
  },
  created() {
    this.getClass();
    if (this.$route.query && this.$route.query.id) {
      let id = JSON.parse(this.$route.query.id);
      this.getWork(id);
    }
  },
  methods: {
    getClass() {
      listByTeacherId(this.id).then((res) => {
        this.clazz = res.data;
      });
    },
    getWork(id) {
      getWorkById(id).then((res) => {
        if (res) {
          this.work = res.data;
        }
      });
    },
    handleVodUploadSuccess(response, file, fileList) {
      this.work.url = response.data.url;
      this.work.originalName = response.data.originalName;
    },
    beforeVodRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleVodRemove() {
      deleteVideo(this.work.originalName).then((res) => {
        this.$message.success("删除成功^-^");
        // 清空地址 以及 名称
        this.work.url = "";
        this.work.originalName = "";
        // 清空列表
        this.fileList = [];
      });
    },
    handleUploadExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    createWork() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.work.id) {
            // 更新
            update(this.work).then((res) => {
              if (res) {
                this.$message.success("修改成功！");
                setTimeout(() => {
                  this.$router.push({ path: `/work/index` });
                }, 1500);
              }
            });
          } else {
            // 创建
            this.work.userId = this.id;
            addWork(this.work).then((res) => {
              if (res) {
                this.$message.success("创建成功！");
                setTimeout(() => {
                  this.$router.push({ path: `/work/index` });
                }, 1500);
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style>
</style>