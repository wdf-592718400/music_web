<template>
  <div>
    <loginLogo />
    <div class="signUp">
      <div class="signUp-head">
        <span>用户注册</span>
      </div>
      <el-form
        :model="registerForm"
        ref="registerForm"
        label-width="70px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-form-item prop="username" label="用户名">
          <el-input
            v-model="registerForm.username"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input
            v-model="registerForm.password"
            placeholder="密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="sex" label="性别">
          <el-radio-group v-model="registerForm.sex">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="phoneNum" label="手机号">
          <el-input
            v-model="registerForm.phoneNum"
            placeholder="手机号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input
            v-model="registerForm.email"
            placeholder="电子邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item prop="birth" label="生日">
          <el-date-picker
            v-model="registerForm.birth"
            placeholder="选择日期"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="introduction" label="签名">
          <el-input
            v-model="registerForm.introduction"
            placeholder="签名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="location" label="地区">
          <el-select
            v-model="registerForm.location"
            placeholder="地区"
            style="width: 100%"
          >
            <el-option
              v-for="item in cities"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="login-btn">
          <el-button @click="goback(-1)">取消</el-button>
          <el-button @click="signUpForm('registerForm')">确定</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import loginLogo from "../components/LoginLogo";
import { rules, cities } from "../assets/data/form";
import { mixin } from "../mixins/index";
import { signUp } from "../api/index";
export default {
  mixins: [mixin],
  name: "sign-up",
  components: {
    loginLogo,
  },
  data() {
    return {
      registerForm: {
        username: "",
        password: "",
        sex: "",
        phoneNum: "",
        email: "",
        birth: "",
        introduction: "",
        location: "",
      },
      cities: [],
      rules: {},
    };
  },
  created() {
    this.rules = rules;
    this.cities = cities;
    this.registerForm.sex = 1;
  },
  methods: {
    signUpForm(registerForm) {
      this.$refs[registerForm].validate((valid) => {
        if (valid) {
          let _this = this;
          let d = new Date(this.registerForm.birth);
          let birth =
            d.getFullYear() +
            "-" +
            (d.getMonth() + 1 >= 10
              ? d.getMonth() + 1
              : "0" + (d.getMonth() + 1)) +
            "-" +
            (d.getDate() >= 10 ? d.getDate() : "0" + d.getDate());
          let params = new URLSearchParams();
          params.append("username", this.registerForm.username);
          params.append("password", this.registerForm.password);
          params.append("sex", this.registerForm.sex);
          params.append("phoneNum", this.registerForm.phoneNum);
          params.append("email", this.registerForm.email);
          params.append("birth", birth);
          params.append("introduction", this.registerForm.introduction);
          params.append("location", this.registerForm.location);
          params.append("avator", "/img/consumerPic/consumer.png");
          signUp(params)
            .then((res) => {
              if (res.code == 1) {
                _this.notify("注册成功", "seccess");
                setTimeout(function () {
                  _this.$store.commit("setActiveName", "登录");
                  _this.$router.push({ path: "/login-in" });
                }, 1000);
              } else if (res.code == 2) {
                _this.notify(res.msg, "error");
              } else {
                _this.notify("注册失败", "error");
              }
            })
            .catch((err) => {
              _this.notify("注册失败", "error");
            });
        } else {
          return false;
        }
      });
    },
    goback(index) {
      this.$router.go(index);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/css/sign-up.scss";
</style>