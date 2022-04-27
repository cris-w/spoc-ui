<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="success" @click="back">返回我的小组</el-button>
    </div>

    <!-- 树形结构 -->
    <el-tree
      ref="unitTree"
      node-key="id"
      :data="list"
      :props="defaultProps"
      default-expand-all
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
      style="margin-top: 20px"
    >
      <span class="custom-tree-node" slot-scope="{ data }">
        <span>{{ data.name }}</span>
        <el-link
          :href="data.url"
          target="_blank"
          :underline="false"
          v-if="data.originalName"
          ><i class="el-icon-view el-icon--right"></i>
        </el-link>
      </span>
    </el-tree>
  </div>
</template>

<script>
import { listUnit } from "@/api/unit";
export default {
  name: "StudentCourse",
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.classId = this.$route.params.id;
      this.getList();
    }
  },
  data() {
    return {
      classId: undefined,
      list: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  methods: {
    getList() {
      console.log(this.classId);
      listUnit(this.classId).then((res) => {
        if (res) {
          this.list = res.data;
        }
      });
    },
    back() {
      this.$router.push("/student/index");
    },
    handleNodeClick(data) {
      if (data.url) {
        window.open(data.url, "_blank");
      }
    },
  },
};
</script>

<style>
</style>