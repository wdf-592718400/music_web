<template>
  <div>
    <div class="info">
      <div class="title" style="text-align: center">
        <span>编辑个人资料</span>
      </div>
      <hr />
      <div class="personal" style="width: 30vw; margin-left: 25%">
        <el-form
          :model="registerForm"
          ref="registerForm"
          label-width="70px"
          :rules="rules"
        >
          <el-form-item prop="username" label="用户名">
            <el-input
              v-model="registerForm.username"
              placeholder="用户名"
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
          <div class="btn">
            <el-button @click="goback(-1)" type="warning" size="mini"
              >返回</el-button
            ><span style="width: 60px"></span>
            <el-button
              @click="saveMsg('registerForm')"
              type="primary"
              size="mini"
              >确定</el-button
            >
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { rules, cities } from "../assets/data/form";
import { mixin } from "../mixins/index";
import { updateUser, getUserOfId } from "../api/index";
export default {
  mixins: [mixin],
  name: "info",
  computed: {
    ...mapGetters(["userId"]),
  },
  data() {
    return {
      registerForm: {
        username: "",
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
    this.getMsg(this.userId);
  },
  methods: {
    getMsg(userId) {
      getUserOfId(userId)
        .then((res) => {
          this.registerForm.username = res.username;
          this.registerForm.sex = res.sex;
          this.registerForm.phoneNum = res.phone_num;
          this.registerForm.email = res.email;
          this.registerForm.birth = new Date(res.birth);
          this.registerForm.introduction = res.introduction;
          this.registerForm.location = res.location;
        })
        .catch((err) => {
          console.log(err);
          this.notify("获取用户信息失败!", "error");
        });
    },
    saveMsg(registerForm) {
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
          params.append("id", this.userId);
          params.append("username", this.registerForm.username);
          params.append("sex", this.registerForm.sex);
          params.append("phoneNum", this.registerForm.phoneNum);
          params.append("email", this.registerForm.email);
          params.append("birth", birth);
          params.append("introduction", this.registerForm.introduction);
          params.append("location", this.registerForm.location);
          updateUser(params)
            .then((res) => {
              if (res.code == 1) {
                _this.$store.commit("setUserName", _this.registerForm.username);
                _this.notify("修改成功", "seccess");
              } else if (res.code == 2) {
                _this.notify(res.msg, "error");
              } else {
                _this.notify("修改失败", "error");
              }
            })
            .catch((err) => {
              _this.notify("修改失败", "error");
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
@import "../assets/css/info.scss";
</style>