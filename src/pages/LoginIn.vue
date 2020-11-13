<template>
  <div>
    <loginLogo />
    <div class="login">
      <div class="login-head">
        <span>账号登陆</span>
      </div>
      <el-form
        :model="loginForm"
        ref="loginForm"
        label-width="70px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-form-item prop="username" label="账号">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名/手机号/电子邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input
            v-model="loginForm.password"
            placeholder="密码"
            type="password"
          ></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button @click="goSignUp">取消</el-button>
          <el-button @click="login('loginForm')">确定</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import loginLogo from "../components/LoginLogo";
import { mixin } from "../mixins/index";
import { loginIn } from "../api/index";
export default {
  mixins: [mixin],
  name: "login-in",
  components: {
    loginLogo,
  },
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.changeIndex("登录");
  },
  methods: {
    login(loginForm) {
      this.$refs[loginForm].validate((valid) => {
        if (valid) {
          let _this = this;
          let params = new URLSearchParams();
          params.append("username", this.loginForm.username);
          params.append("password", this.loginForm.password);
          loginIn(params)
            .then((res) => {
              if (res.code == 1) {
                _this.notify("登录成功", "seccess");
                _this.$store.commit("setLoginIn", true);
                _this.$store.commit("setUserId", res.userMsg.id);
                _this.$store.commit("setUserName", res.userMsg.username);
                _this.$store.commit("setAvator", res.userMsg.avator);
                setTimeout(function () {
                  _this.changeIndex("首页");
                  _this.$router.push({ path: "/" });
                }, 1000);
              } else {
                _this.notify("用户名或密码错误", "error");
              }
            })
            .catch((err) => {
              _this.notify("用户名或密码错误", "error");
            });
        } else {
          return false;
        }
      });
    },
    goSignUp() {
      this.changeIndex("注册");
      this.$router.push({ path: "/sign-up" });
    },
    changeIndex(val) {
      this.$store.commit("setActiveName", val);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/css/login-in.scss";
</style>