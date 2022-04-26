<template>
  <div class="app-container">
    <el-table :data="list" fit style="width: 100%" highlight-current-row>
      <el-table-column label="作业名称" prop="name" align="center">
      </el-table-column>
      <el-table-column label="描述" prop="desc" align="center">
      </el-table-column>
      <el-table-column label="截止时间" prop="deadline" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="handleRead(row.id)"
            >批阅</el-button
          >
          <el-button size="mini" type="text" @click="handleEdit(row.id)"
            >编辑</el-button
          >
          <el-button size="mini" type="text" @click="handleDelete(row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { listWork, deleteById } from "@/api/twork";
import { mapGetters } from "vuex";
export default {
  name: "Work",
  computed: {
    ...mapGetters(["id"]),
  },
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      listWork(this.id).then((res) => {
        if (res) {
          this.list = res.data;
        }
      });
    },
    handleRead(id) {
      this.$router.push({ path: `/work/read/${id}` });
    },
    handleEdit(id) {
      this.$router.push({
        path: `/work/publish`,
        query: { id },
      });
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteById(id).then((res) => {
            if (res) {
              this.$message.success("删除成功");
              this.getList();
            }
          });
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
</style>