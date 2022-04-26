<template>
  <div class="app-container">
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
            编辑小组信息
          </el-button>
          <el-button size="mini" type="text" @click="undateUnit(row.id)">
            编辑单元信息
          </el-button>
          <el-button size="mini" type="text" @click="editMenber(row.id)">
            小组成员管理
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑小组信息" :visible.sync="dialogFormVisible">
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
        <el-button type="primary" @click="updateData()"> 提交 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listByTeacherId, getClassroomById, update } from "@/api/classroom";
import { mapGetters } from "vuex";
export default {
  name: "Member",
  computed: {
    ...mapGetters(["id"]),
  },
  data() {
    return {
      list: [],
      listLoading: false,
      dialogFormVisible: false,
      temp: {
        name: "",
        desc: "",
      },
      teachers: [],
      rules: {
        name: [{ required: true, message: "请输入小组名", trigger: "blur" }],
        desc: [{ required: true, message: "请输入描述", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    resetTemp() {
      this.temp = {
        name: "",
        desc: "",
      };
    },
    getList() {
      this.listLoading = true;
      listByTeacherId(this.id)
        .then((res) => {
          this.list = res.data;
          this.listLoading = false;
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },
    handleUpdate(id) {
      this.resetTemp();
      getClassroomById(id).then((res) => {
        if (res) {
          const { data } = res;
          this.temp.id = id;
          this.temp.name = data.name;
          this.temp.desc = data.desc;
        }
        this.dialogFormVisible = true;
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
    undateUnit(id) {
      this.$router.push({ path: `/group/unit/${id}` });
    },
    editMenber(id) {
      this.$router.push({ path: `/group/AddMember/${id}` });
    },
  },
};
</script>

<style>
</style>