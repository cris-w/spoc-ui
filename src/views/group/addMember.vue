<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="success" icon="el-icon-edit" @click="handCreate"
        >添加成员</el-button
      >
      <el-button type="primary" class="addBtn" @click="toMyClass"
        >返回我的小组</el-button
      >
    </div>

    <!-- table -->
    <el-table
      ref="UserTab"
      :data="list"
      tooltip-effect="dark"
      style="width: 100%"
      row-key="id"
      fit
      highlight-current-row
    >
      <el-table-column label="头像" prop="avatar" align="center" width="50px">
        <template slot-scope="{ row }">
          <el-avatar
            size="small"
            :src="
              row.avatar ||
              'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
            "
          ></el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="nickname" align="center">
      </el-table-column>
      <el-table-column label="性别" align="center">
        <template slot-scope="{ row }">
          <el-tag type="info" size="mini" v-if="row.sex == 0">女</el-tag>
          <el-tag type="info" size="mini" v-else>男</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email" align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="350"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="handleDelete(row.id)">
            移除小组
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加组员" :visible.sync="dialogFormVisible">
      <el-button
        size="mini"
        type="primary"
        @click="create"
        :disabled="userIds.length === 0"
        >确定</el-button
      >
      <el-table
        :data="filterList"
        tooltip-effect="dark"
        style="width: 100%"
        row-key="id"
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="头像" prop="avatar" align="center" width="50px">
          <template slot-scope="{ row }">
            <el-avatar
              size="small"
              :src="
                row.avatar ||
                'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
              "
            ></el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="nickname" align="center">
        </el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="{ row }">
            <el-tag type="info" size="mini" v-if="row.sex == 0">女</el-tag>
            <el-tag type="info" size="mini" v-else>男</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" prop="email" align="center">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  listMember,
  removeMember,
  listStudent,
  joinClass,
} from "@/api/classroom";
export default {
  name: "AddMember",
  data() {
    return {
      classId: undefined,
      list: [],
      userList: [],
      filterList: [],
      dialogFormVisible: false,
      userIds: [],
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.classId = this.$route.params.id;
      this.getList();
    }
    this.getStudentList();
  },
  methods: {
    getList() {
      listMember(this.classId).then((res) => {
        if (res) {
          this.list = res.data;
        }
      });
    },
    getStudentList() {
      listStudent().then((res) => {
        if (res) {
          this.userList = res.data;
        }
      });
    },
    handleDelete(id) {
      this.$confirm("确定要将该同学移除小组吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          removeMember(this.classId, id).then((res) => {
            if (res) {
              this.getList();
              this.$message.success({ type: "success", message: "移除成功" });
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
    handCreate() {
      this.filterUser();
      this.dialogFormVisible = true;
    },
    create() {
      joinClass(this.classId, this.userIds).then((res) => {
        if (res) {
          this.$message.success("添加成功");
          this.getList();
          this.dialogFormVisible = false;
        }
      });
    },
    // 过滤已经在小组中的用户
    filterUser() {
      this.filterList = this.userList.filter((user) => {
        return !this.list.find((u) => u.id === user.id);
      });
      console.log(this.filterList);
    },
    handleSelectionChange(val) {
      if (val) {
        this.userIds = val.map((v) => {
          return v.id;
        });
      }
    },
    toMyClass() {
      this.$router.push({ path: `/group/member` });
    },
  },
};
</script>

<style>
</style>