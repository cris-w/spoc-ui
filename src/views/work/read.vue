<template>
  <div class="app-container">
    <!-- table -->
    <el-table
      :data="list"
      key="id"
      fit
      style="width: 100%"
      highlight-current-row
    >
      <el-table-column type="expand">
        <template slot-scope="{ row }">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="学生姓名">
              <span>{{ row.userName }}</span>
            </el-form-item>
            <el-form-item label="得分">
              <span>{{ row.grade }}</span>
            </el-form-item>
            <el-form-item label="作业">
              <el-link
                :underline="false"
                icon="el-icon-download"
                :href="row.url"
                >点击下载</el-link
              >
            </el-form-item>
            <el-form-item label="评语">
              <span>{{ row.remark }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" prop="userName" />
      <el-table-column
        align="center"
        label="分数"
        prop="grade"
        sortable
        sort-by="grade"
      >
      </el-table-column>
      <el-table-column label="状态" align="center" sortable :sort-method="sort">
        <template slot-scope="{ row }">
          <el-tag type="success" v-if="row.grade">已批阅</el-tag>
          <el-tag type="danger" v-else>未批阅</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="{ row }">
          <el-button type="text" size="mini" @click="handleRead(row.id)">
            批阅
          </el-button>
          <el-button type="text" size="mini" @click="handleDelete(row.id)">
            打回
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="批阅" :visible.sync="dialogFormVisible">
      <el-form :model="score">
        <el-form-item label="分数名称" label-width="120px">
          <el-input-number
            v-model="score.grade"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="评语" label-width="120px">
          <el-input type="textarea" v-model="score.remark" :rows="5"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="read">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listScore, update, getScoreById, deleteById } from "@/api/score";
export default {
  name: "Read",
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.tworkId = JSON.parse(this.$route.params.id);
      this.getList();
    }
  },
  data() {
    return {
      list: [],
      tworkId: undefined,
      dialogFormVisible: false,
      score: {
        id: undefined,
        grade: 0,
        remark: "",
      },
    };
  },
  methods: {
    getList() {
      listScore(this.tworkId).then((res) => {
        if (res) this.list = res.data;
      });
    },
    resetScore() {
      this.score = {
        id: undefined,
        grade: 0,
        remark: "",
      };
    },
    // 排序
    sort(a, b) {
      return a - b;
    },
    handleRead(id) {
      this.resetScore();
      this.score.id = id;
      getScoreById(id).then((res) => {
        if (res) {
          this.score.grade = res.data.grade;
          this.score.remark = res.data.remark;
        }
      });
      this.dialogFormVisible = true;
    },
    read() {
      update(this.score).then((res) => {
        if (res) {
          this.$message.success("批阅成功");
          this.getList();
          this.dialogFormVisible = false;
        }
      });
    },
    handleDelete(id) {
      this.$confirm("打回后学生将重新提交作业, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteById(id).then((res) => {
            if (res) {
              this.$message.success("打回成功");
              this.getList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
  },
};
</script>

<style>
</style>