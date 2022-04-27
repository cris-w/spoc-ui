<template>
  <div class="app-container">
    <el-card style="width: 60%">
      <h3>修改用户信息</h3>
      <el-form ref="form" :model="user" :rules="rules" label-width="80px">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="user.nickname" style="width: 60%"></el-input>
        </el-form-item>
        <el-form-item label="原密码" prop="oldpass">
          <el-input v-model="user.oldpass" style="width: 60%"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="user.password" style="width: 60%"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">修改</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { update } from "@/api/user";
export default {
  name: "Setting",
  computed: {
    ...mapGetters(["id", "nickname", "password"]),
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (value !== this.password) {
          callback(new Error("原密码输入错误"));
        }
        callback();
      }
    };
    var validatePass1 = (rule, value, callback) => {
      if (value.trim().length < 6) {
        callback(new Error("密码不能小于6位"));
      } else {
        callback();
      }
    };
    return {
      user: {
        id: undefined,
        nickname: "",
        password: "",
        oldpass: "",
      },
      rules: {
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        oldpass: [{ validator: validatePass, trigger: "blur" }],
        password: [{ validator: validatePass1, trigger: "blur" }],
      },
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.user.id = this.id;
      this.user.nickname = this.nickname;
    },
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          update(this.user)
            .then((res) => {
              if (res) {
                this.$message.success("修改成功");
                setTimeout(() => {
                  this.$router.push("/");
                }, 1500);
              }
            })
            .catch((err) => {});
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