<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        style="width: 200px; margin-bottom: 20px"
        v-model="listQuery.username"
        @keyup.enter.native="handFilter"
      >
      </el-input>

      <el-button type="primary" icon="el-icon-search" @click="handFilter"
        >搜索</el-button
      >
      <el-button type="success" icon="el-icon-edit" @click="handCreate"
        >创建</el-button
      >
      <el-button
        type="danger"
        icon="el-icon-delete"
        @click="delBatch"
        :disabled="delIds.length == 0"
        >批量删除</el-button
      >
    </div>

    <!-- table -->
    <el-table
      v-loading="listLoading"
      ref="UserTab"
      :data="list"
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
      <el-table-column label="用户名" prop="username" align="center">
      </el-table-column>
      <el-table-column label="昵称" prop="nickname" align="center">
      </el-table-column>
      <el-table-column label="角色" prop="role" align="center">
        <template slot-scope="{ row }">
          <el-tag size="mini" v-if="row.role == 'admin'">管理员</el-tag>
          <el-tag type="success" size="mini" v-else-if="row.role == 'teacher'"
            >老师</el-tag
          >
          <el-tag type="info" size="mini" v-else>学生</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center">
        <template slot-scope="{ row }">
          <el-tag type="info" size="mini" v-if="row.sex == 0">女</el-tag>
          <el-tag type="info" size="mini" v-else>男</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email" align="center">
      </el-table-column>
      <el-table-column label="状态" prop="status" width="80px" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
          <el-tag v-else-if="scope.row.status === 0" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="350"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="text" size="mini" @click="handleUpdate(row.id)">
            编辑
          </el-button>
          <el-button size="mini" type="text" @click="handleDelete(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加用户表单 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="80px"
        style="width: 500px; margin-left: 50px"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="昵称" prop="username">
          <el-input v-model="temp.nickname" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="temp.sex">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-radio-group v-model="temp.role">
            <el-radio label="admin">管理员</el-radio>
            <el-radio label="teacher">老师</el-radio>
            <el-radio label="student">学生</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="temp.status">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 返回 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  list,
  getUserById,
  addUser,
  update,
  deleteById,
  delBatch,
} from "@/api/user";

export default {
  name: "UserList",

  data() {
    return {
      list: [],
      listLoading: false,
      listQuery: {
        username: "",
      },
      delIds: [],
      textMap: {
        update: "编辑",
        create: "创建",
      },
      dialogStatus: "",
      dialogFormVisible: false,
      temp: {
        username: "",
        nickname: "",
        role: "",
        password: "",
        email: "",
        sex: "",
        status: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        role: [{ required: true, message: "请选择角色", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    resetTemp() {
      this.temp = {
        username: "",
        nickname: "",
        role: "",
        password: "",
        email: "",
        sex: "",
        status: "",
      };
    },
    getList() {
      this.listLoading = true;
      list(this.listQuery).then((res) => {
        if (res) {
          this.list = res.data;
          this.listLoading = false;
        }
      });
    },
    handFilter() {
      this.getList();
    },
    handCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          addUser(this.temp).then((res) => {
            if (res) {
              this.dialogFormVisible = false;
              this.getList();
              this.$message.success("创建成功");
            }
          });
        }
      });
    },
    handleUpdate(id) {
      this.resetTemp();
      getUserById(id).then((res) => {
        if (res) {
          const { data } = res;
          this.temp.id = id;
          this.temp.username = data.username;
          this.temp.nickname = data.nickname;
          this.temp.password = data.password;
          this.temp.email = data.email;
          this.temp.role = data.role;
          this.temp.sex = data.sex;
          this.temp.status = data.status;
        }
        (this.dialogStatus = "update"), (this.dialogFormVisible = true);
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          update(this.temp).then((res) => {
            if (res) {
              this.dialogFormVisible = false;
              this.getList();
              this.$message({ type: "success", message: "修改成功" });
            }
          });
        }
      });
    },
    handleDelete(id) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteById(id).then((res) => {
            if (res) {
              this.getList();
              this.$message.success({ type: "success", message: "删除成功" });
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
    handleSelectionChange(val) {
      if (val) {
        this.delIds = val.map((v) => {
          return v.id;
        });
      }
    },
    delBatch() {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delBatch(this.delIds).then((res) => {
            if (res) {
              this.getList();
              this.$message.success({ type: "success", message: "删除成功" });
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
