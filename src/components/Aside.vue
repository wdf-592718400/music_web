<template>
  <transition name="slide-fade">
    <div class="the-aside" v-show="showAside">
      <h2 class="title">播放列表</h2>
      <ul class="menus">
        <li
          v-for="(item, index) in listOfSongs"
          :key="index"
          :class="{ 'is-play': id == item.id }"
          @click="
            toPlay(item.id, item.url, item.pic, index, item.name, item.lyric)
          "
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { getCollectOfUserId } from "../api/index";
export default {
  name: "the-aside",
  computed: {
    ...mapGetters([
      "showAside", // 是否显示播放中的歌曲列表
      "listOfSongs", // 当前歌曲列表
      "id", // 播放中的音乐的 ID
      "userId",
      "loginIn"
    ]),
  },
  mounted() {
    let _this = this;
    document.querySelector(".the-aside").addEventListener(
      "click",
      function (e) {
        e.stopPropagation();
      },
      false
    );
    document.addEventListener(
      "click",
      function () {
        _this.$store.commit("setShowAside", false);
      },
      false
    );
  },
  methods: {
    // 获取歌手名字
    replaceLName(val) {
      let arr = val.split("-");
      return arr[0];
    },
    // 获取歌名
    replaceFName(val) {
      let arr = val.split("-");
      return arr[1];
    },
    // 播放
    toPlay: function (id, url, pic, index, name, lyric) {
      this.$store.commit("setId", id);
      this.$store.commit("setUrl", this.$store.state.configure.HOST + url);
      this.$store.commit("setPicUrl", this.$store.state.configure.HOST + pic);
      this.$store.commit("setListIndex", index);
      this.$store.commit("setTitle", this.replaceFName(name));
      this.$store.commit("setArtist", this.replaceLName(name));
      this.$store.commit("setLyric", this.parseLyric(lyric));
      this.$store.commit("setIsActive", false);
      if (this.loginIn) {
        getCollectOfUserId(this.userId).then((res) => {
          for (let item of res) {
            if (item.song_id == this.id) {
              this.$store.commit("setIsActive", true);
              break;
            }
          }
        });
      }
    },
    // 解析歌词
    parseLyric(text) {
      let lines = text.split("\n");
      let pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g; // 分离出来时间部分
      let res = [];
      if (!/\[.+\]/.test(text)) {
        return [[0, text]];
      }

      while (!pattern.test(lines[0])) {
        lines = lines.slice(1);
      }

      for (let line of lines) {
        let time = line.match(pattern);
        let value = line.replace(pattern, "");
        for (let item of time) {
          let t = item.slice(1, -1).split(":");
          if (value != "") {
            res.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
          }
        }
      }
      res.sort(function (a, b) {
        return a[0] - b[0];
      });
      return res;
    },
  },
};
</script>

<style lang='scss' scoped>
@import "../assets/css/the-aside.scss";
</style>