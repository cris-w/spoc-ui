<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="8" v-for="item in list" :key="item.id">
        <el-card shadow="hover" style="height: 250px">
          <div slot="header">
            <span>{{ item.name }}</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="doWork(item.id)"
              :disabled="item.worked || item.out"
              >提交作业</el-button
            >
          </div>
          <span
            ><el-link
              :href="item.url"
              :underline="false"
              v-if="item.originalName"
              >点击下载<i class="el-icon-download el-icon--right"></i> </el-link
          ></span>
          <h4>截止时间：{{ item.deadline }}</h4>
          <p>描述：{{ item.desc }}</p>
          <div>
            状态：
            <el-tag type="success" v-if="item.worked">已完成</el-tag>
            <el-tag type="danger" v-else-if="item.out">已过期</el-tag>
            <el-tag type="warning" v-else>未完成</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="上传作业" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="score" label-width="80px">
        <el-form-item label="上传文件">
          <el-link
            :href="score.url"
            :underline="false"
            v-if="score.originalName"
            >点击下载<i class="el-icon-download el-icon--right"></i>
          </el-link>
          <i
            v-if="score.originalName"
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
            v-show="score.originalName.length == 0"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitWork">确定</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { listWorkById } from "@/api/twork";
import { listWorkedIds, submitWork } from "@/api/score";
import { deleteVideo } from "@/api/unit";
import { mapGetters } from "vuex";
export default {
  name: "Homework",
  computed: {
    ...mapGetters(["id", "name"]),
  },
  data() {
    return {
      list: [],
      // 已完成的作业ids
      workedIds: [],
      dialogFormVisible: false,
      score: {
        userId: undefined,
        userName: "",
        tworkId: undefined,
        url: "",
        originalName: "",
      },
      fileList: [],
      BASE_API: process.env.VUE_APP_BASE_API,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      listWorkById(this.id).then((res) => {
        if (res) {
          this.list = res.data;
          listWorkedIds(this.id).then((res) => {
            this.workedIds = res.data;
            this.filterWorked();
          });
        }
      });
    },
    // 给已经完成的作业添加标记
    filterWorked() {
      this.list.forEach((l) => {
        let now = new Date();
        let time = new Date(l.deadline.replace(/-/g, "/"));
        if (now.getTime() > time.getTime()) {
          l.out = true;
        }
        if (this.workedIds.indexOf(l.id) != -1) {
          l.worked = true;
        }
      });
      this.$forceUpdate();
    },
    handleVodUploadSuccess(response, file, fileList) {
      this.score.url = response.data.url;
      this.score.originalName = response.data.originalName;
    },
    beforeVodRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleVodRemove() {
      deleteVideo(this.score.originalName).then((res) => {
        this.$message.success("删除成功^-^");
        // 清空地址 以及 名称
        this.score.url = "";
        this.score.originalName = "";
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
    resetScore() {
      this.score = {
        userId: undefined,
        userName: "",
        tworkId: undefined,
        url: "",
        originalName: "",
      };
    },
    doWork(id) {
      this.resetScore();
      this.score.tworkId = id;
      this.dialogFormVisible = true;
    },
    submitWork() {
      this.score.userId = this.id;
      this.score.userName = this.name;
      console.log(this.score);
      submitWork(this.score).then((res) => {
        if (res) {
          this.$message.success("提交成功");
          this.getList();
          this.dialogFormVisible = false;
        }
      });
    },
  },
};
</script>

<style>
</style>