<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-input
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        style="width: 200px; margin-bottom: 20px"
        v-model="listQuery.name"
        @keyup.enter.native="handFilter"
      >
      </el-input>

      <el-button type="primary" icon="el-icon-search" @click="handFilter"
        >搜索</el-button
      >
      <el-button type="success" icon="el-icon-edit" @click="handCreate"
        >创建</el-button
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
    >
      <el-table-column label="小组名" prop="name" align="center">
      </el-table-column>
      <el-table-column label="所属老师" prop="teacherName" align="center">
      </el-table-column>
      <el-table-column label="描述" prop="desc" align="center">
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

    <!-- 添加小组表单 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="80px"
        style="width: 500px; margin-left: 50px"
      >
        <el-form-item label="小组名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="所属老师" prop="teacherId">
          <el-select v-model="temp.teacherId" placeholder="请选择">
            <el-option
              v-for="item in teachers"
              :key="item.id"
              :label="item.nickname"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="temp.desc"
          >
          </el-input>
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
  listClassroom,
  getTeacherList,
  getClassroomById,
  addClassroom,
  update,
  deleteById,
} from "@/api/classroom";
export default {
  name: "Group",
  data() {
    return {
      list: [],
      listLoading: false,
      listQuery: {
        name: "",
      },
      textMap: {
        update: "编辑",
        create: "创建",
      },
      dialogStatus: "",
      dialogFormVisible: false,
      temp: {
        name: "",
        teacherId: undefined,
        desc: "",
      },
      teachers: [],
      rules: {
        name: [{ required: true, message: "请输入小组名", trigger: "blur" }],
        teacherId: [{ required: true, message: "请选择老师", trigger: "blur" }],
        desc: [{ required: true, message: "请输入描述", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
    this.getTeacherList();
  },
  methods: {
    resetTemp() {
      this.temp = {
        name: "",
        teacherId: undefined,
        desc: "",
      };
    },
    getList() {
      this.listLoading = true;
      listClassroom(this.listQuery)
        .then((res) => {
          this.list = res.data;
          this.listLoading = false;
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },
    getTeacherList() {
      getTeacherList().then((res) => {
        if (res) {
          this.teachers = res.data;
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
          addClassroom(this.temp).then((res) => {
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
      getClassroomById(id).then((res) => {
        if (res) {
          const { data } = res;
          this.temp.id = id;
          this.temp.name = data.name;
          this.temp.teacherId = data.teacherId;
          this.temp.desc = data.desc;
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
  },
};
</script>

<style>
</style>