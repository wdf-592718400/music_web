<template>
  <div class="the-header">
    <div class="header-logo" @click="goHome">
      <svg class="icon">
        <use xlink:href="#icon-erji"></use>
      </svg>
      <span>WDF-music</span>
    </div>
    <ul class="navbar">
      <li
        :class="{ active: item.name == activeName }"
        v-for="item in navMsg"
        :key="item.path"
        @click="goPage(item.path, item.name)"
      >
        {{ item.name }}
      </li>
      <li>
        <div class="header-search">
          <input
            type="text"
            placeholder="搜索音乐"
            @keyup.enter="goSearch()"
            v-model="keywords"
          />
          <div class="search-btn" @click="goSearch()">
            <svg class="icon">
              <use xlink:href="#icon-sousuo"></use>
            </svg>
          </div>
        </div>
      </li>
      <li
        v-show="!loginIn"
        :class="{ active: item.name == activeName }"
        v-for="item in loginMsg"
        :key="item.path"
        @click="goPage(item.path, item.name)"
      >
        {{ item.name }}
      </li>
    </ul>
    <div class="header-right" v-show="loginIn">
      <div id="user">
        <img :src="attachImagUrl(avator)" />
      </div>
      <ul class="menu">
        <li
          v-for="(item, index) in menuList"
          :key="index"
          @click="goMenuList(item.path)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { navMsg, loginMsg, menuList } from "../assets/data/herder";
export default {
  name: "theHeader",
  data() {
    return {
      navMsg: [], // 导航栏
      keywords: "", // 搜索关键字
      loginMsg: [], // 右侧导航栏
      menuList: [], // 下拉菜单
    };
  },
  computed: {
    ...mapGetters(["activeName", "loginIn", "avator", "searchWord", "loginIn"]),
  },
  created() {
    this.navMsg = navMsg;
    this.loginMsg = loginMsg;
    this.menuList = menuList;
  },
  mounted() {
    document.querySelector("#user").addEventListener(
      "click",
      function (e) {
        document.querySelector(".menu").classList.add("show");
        e.stopPropagation();
      },
      false
    );
    document.querySelector(".menu").addEventListener(
      "click",
      function (e) {
        e.stopPropagation();
      },
      false
    );
    document.addEventListener(
      "click",
      function (e) {
        document.querySelector(".menu").classList.remove("show");
        e.stopPropagation();
      },
      false
    );
  },
  watch: {
    searchWord() {
      this.keywords = this.searchWord;
    },
  },
  methods: {
    goHome() {
      if (this.activeName == "首页" && this.$route.path == "/") {
        return;
      }
      this.$store.commit("setActiveName", "首页");
      this.$router.push({ path: "/" });
    },
    goPage(path, name) {
      if (this.activeName == name) {
        return;
      }
      if (!this.loginIn && path == "/my-music") {
        this.$notify({title: "请先登录!", type: "error"});
        return;
      }
      this.$store.commit("setActiveName", name);
      this.$router.push({ path: path });
    },
    goSearch() {
      if (this.$route.path == "/search" && this.keywords == this.searchWord) {
        return;
      }
      this.$store.commit("setSearchWord", this.keywords);
      this.$router.push({
        path: "/search",
        query: { keywords: this.keywords },
      });
    },
    // 获取图片地址
    attachImagUrl(srcUrl) {
      return srcUrl
        ? this.$store.state.configure.HOST + srcUrl
        : "../assets/img/user.jpg";
    },
    goMenuList(path) {
      if (path == 0) {
        this.$store.commit("setLoginIn", false);
        this.$router.push({ path: '/login-in' });
      } else {
        this.$router.push({ path: path });
      }
    },
  },
};
</script>

<style lang='scss' scoped>
@import "../assets/css/the-header.scss";
</style>