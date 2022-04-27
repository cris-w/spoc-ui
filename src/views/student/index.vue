<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in list" :key="item.id">
        <el-card shadow="hover" style="height: 200px">
          <div slot="header">
            <span>{{ item.name }}</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="study(item.id)"
              >开始学习</el-button
            >
          </div>
          <h4>老师：{{ item.teacherName }}</h4>
          <p>描述：{{ item.desc }}</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listStudentClass } from "@/api/classroom";
import { mapGetters } from "vuex";
export default {
  name: "StudentIndex",
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
      listStudentClass(this.id).then((res) => {
        if (res) {
          this.list = res.data;
        }
      });
    },
    study(id) {
      this.$router.push({ path: `/student/course/${id}` });
    },
  },
};
</script>

<style>
</style>