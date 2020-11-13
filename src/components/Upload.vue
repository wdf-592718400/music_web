<template>
  <div class="upload">
    <p class="title">修改头像</p>
    <hr />
    <div class="section">
      <el-upload
        drag
        :action="uploadUrl()"
        :show-file-list="false"
        :on-success="handleAvatorSuccess"
        :before-upload="beforeAvatorUpload"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处修改头像, 或者<em>点击选择文件</em></div>
      </el-upload>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mixin } from "../mixins/index";
import { updateUser, getUserOfId } from "../api/index";
export default {
  mixins: [mixin],
  name: "upload",
  computed: {
    ...mapGetters(["userId"]),
  },
  data() {
    return {};
  },
  methods: {
    uploadUrl() {
      return `${this.$store.state.configure.HOST}/consumer/updateConsumerPic?id=${this.userId}`;
    },
    handleAvatorSuccess(res, file) {
      if (res.code == 1) {
        this.$store.commit("setAvator", res.avator);
        this.notify("修改成功", "success");
      } else {
        this.notify("修改失败", "error");
      }
    },
    beforeAvatorUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) this.$message.error("上传头像只能是 jpg 或 png 格式!");
      if (!isLt2M) this.$message.error("上传头像大小不能超过 2 MB");
      return isJPG && isLt2M;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/css/upload.scss";
</style>