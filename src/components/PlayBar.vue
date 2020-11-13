<template>
  <div class="play-bar" :class="{ show: !toggle }">
    <div @click="toggle = !toggle" class="item-up" :class="{ turn: !toggle }">
      <svg class="icon">
        <use xlink:href="#icon-jiantou-xia-cuxiantiao"></use>
      </svg>
    </div>
    <div class="kongjian">
      <!-- 上一首 -->
      <div class="item" @click="prev">
        <svg class="icon">
          <use xlink:href="#icon-ziyuanldpi"></use>
        </svg>
      </div>
      <!-- 播放 -->
      <div class="item" @click="togglePlay">
        <svg class="icon">
          <use :xlink:href="playButtonUrl"></use>
        </svg>
      </div>
      <!-- 下一首 -->
      <div class="item" @click="next">
        <svg class="icon">
          <use xlink:href="#icon-ziyuanldpi1"></use>
        </svg>
      </div>
      <!-- 歌曲图片 -->
      <div class="item-img" @click="toLysic" style="cursor: pointer">
        <img :src="picUrl" />
      </div>
      <!-- 播放进度 -->
      <div class="playing-speed">
        <!-- 播放开始时间 -->
        <div class="current-time">{{ formatSeconds(nowTime) }}</div>
        <div class="progress-box">
          <div class="item-song-title">
            <div>{{ this.title }}</div>
            <div>{{ this.artist }}</div>
          </div>
          <div class="progress" ref="progress" @mousemove="mouseMove">
            <!-- 进度条 -->
            <div ref="bg" class="bg" @click="updateMove">
              <div
                ref="curProgress"
                class="cur-progress"
                :style="{ width: curLength + '%' }"
              ></div>
            </div>
            <!-- 拖动的点 -->
            <div
              ref="idot"
              class="idot"
              :style="{ left: curLength + '%' }"
              @mousedown="mouseDown"
              @mouseup="mouseUp"
            ></div>
          </div>
        </div>
        <!-- 播放结束时间 -->
        <div class="left-time">{{ formatSeconds(songTime) }}</div>
        <!-- 音量 -->
        <div class="item item-volume">
          <svg class="icon" v-if="volume == 0">
            <use xlink:href="#icon-yinliangjingyinheix"></use>
          </svg>
          <svg class="icon" v-else>
            <use xlink:href="#icon-yinliang1"></use>
          </svg>
          <el-slider
            class="volume"
            v-model="volume"
            :vertical="true"
          ></el-slider>
        </div>
        <!-- 收藏 -->
        <div class="item" @click="collection">
          <svg :class="{active: isActive}" class="icon">
            <use xlink:href="#icon-xihuan-shi"></use>
          </svg>
        </div>
        <!-- 下载 -->
        <div class="item" @click="download">
          <svg class="icon">
            <use xlink:href="#icon-xiazai"></use>
          </svg>
        </div>
        <!-- 当前播放的歌曲列表 -->
        <div id="list" class="item" @click="changeAside">
          <svg class="icon">
            <use xlink:href="#icon-liebiao"></use>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { download, setCollect } from "../api/index";
export default {
  name: "play-bar",
  data() {
    return {
      nowTime: "00:00", // 当前播放进度的时间
      songTime: "00:00", // 当前歌曲总时间
      curLength: 0, // 进度条位置
      progressLength: 0, //进度条总长度
      mouseStartX: 0, // 拖拽开始位置
      tag: false, // 拖拽开始结束的标志
      volume: 50, // 音量
      toggle: true, // 播放器是否显示
    };
  },
  computed: {
    ...mapGetters([
      "isPlay", // 是否播放中
      "url", // 歌曲地址
      "id", // 歌曲 ID
      "playButtonUrl", // 播放状态图标
      "picUrl", // 正在播放的音乐图片
      "title", // 歌名
      "artist", // 歌手名
      "duration", // 音乐时长
      "curTime", // 当前音乐的播放位置
      "listIndex", // 当前歌曲在歌单中的位置
      "listOfSongs", // 存放歌曲
      "autoNext", // 是否自动播放下一首
      "loginIn", // 用户是否已登录
      "userId", // 当前登录用户的 ID
      "isActive",  // 当前歌曲是否已收藏
    ]),
  },
  watch: {
    // 切换播放状态图标
    isPlay() {
      if (this.isPlay) {
        this.$store.commit("setPlayButtonUrl", "#icon-zanting");
      } else {
        this.$store.commit("setPlayButtonUrl", "#icon-bofang");
      }
    },
    curTime() {
      this.nowTime = this.curTime;
      this.songTime = this.duration;
      this.curLength = (this.curTime / this.duration) * 100;
    },
    // 音量变化
    volume() {
      this.$store.commit("setVolume", this.volume / 100);
    },
    // 自动播放下一首
    autoNext() {
      this.next();
    },
  },
  mounted() {
    this.progressLength = this.$refs.progress.getBoundingClientRect().width;
    document.querySelector(".item-volume").addEventListener(
      "click",
      function (e) {
        document.querySelector(".volume").classList.add("show-volume");
        e.stopPropagation();
      },
      false
    );
    document.querySelector(".volume").addEventListener(
      "click",
      function (e) {
        e.stopPropagation();
      },
      false
    );
    document.querySelector("#list").addEventListener(
      "click",
      function (e) {
        e.stopPropagation();
      },
      false
    );
    document.addEventListener(
      "click",
      function () {
        document.querySelector(".volume").classList.remove("show-volume");
      },
      false
    );
    this.togglePlay();
  },
  methods: {
    // 控制音乐播放暂停
    togglePlay() {
      if (this.isPlay) {
        this.$store.commit("setIsPlay", false);
      } else {
        this.$store.commit("setIsPlay", true);
      }
    },
    // 解析时间
    formatSeconds(val) {
      let theTime = parseInt(val);
      let min = parseInt(theTime / 60);
      let sec = parseInt(theTime % 60);
      let res = "";
      res +=
        (min >= 10 ? min : "0" + min) + ":" + (sec >= 10 ? sec : "0" + sec);
      return res;
    },
    mouseDown(e) {
      this.mouseStartX = e.clientX;
      this.tag = true;
    },
    mouseUp() {
      this.tag = false;
    },
    mouseMove(e) {
      if (!this.duration) {
        this.tag = false;
        return false;
      }
      if (this.tag) {
        let movementX = e.clientX - this.mouseStartX; // 点点移动的距离
        let curLength = this.$refs.curProgress.getBoundingClientRect().width;
        let newPercent = ((movementX + curLength) / this.progressLength) * 100;
        if (newPercent >= 100) {
          newPercent = 100;
        }
        if (newPercent <= 0) {
          newPercent = 0;
        }
        this.curLength = newPercent;
        this.mouseStartX = e.clientX;
        this.changeTime(newPercent);
      }
    },
    // 更改歌曲进度
    changeTime(percent) {
      let newCurTime = percent * 0.01 * this.duration;
      this.$store.commit("setChangeTime", newCurTime);
    },
    // 点击播放条切换播放进度
    updateMove(e) {
      if (!this.tag) {
        // 进度条左侧坐标
        let curLength = this.$refs.bg.offsetLeft;
        let newPercent = ((e.clientX - curLength) * 100) / this.progressLength;
        if (newPercent >= 100) {
          newPercent = 100;
        }
        if (newPercent <= 0) {
          newPercent = 0;
        }
        this.curLength = newPercent;
        this.changeTime(newPercent);
      }
    },
    // 显示播放中的歌曲列表
    changeAside() {
      this.$store.commit("setShowAside", true);
    },
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
    toPlay: function (url) {
      this.$store.commit("setId", this.listOfSongs[this.listIndex].id);
      this.$store.commit("setUrl", this.$store.state.configure.HOST + url);
      this.$store.commit(
        "setPicUrl",
        this.$store.state.configure.HOST + this.listOfSongs[this.listIndex].pic
      );
      this.$store.commit(
        "setTitle",
        this.replaceFName(this.listOfSongs[this.listIndex].name)
      );
      this.$store.commit(
        "setArtist",
        this.replaceLName(this.listOfSongs[this.listIndex].name)
      );
      this.$store.commit(
        "setLyric",
        this.parseLyric(this.listOfSongs[this.listIndex].lyric)
      );
    },
    // 上一首
    prev() {
      if (this.listIndex != -1 && this.listOfSongs.length > 1) {
        if (this.listIndex > 0) {
          this.$store.commit("setListIndex", this.listIndex - 1);
        } else {
          this.$store.commit("setListIndex", this.listOfSongs.length - 1);
        }
        this.toPlay(this.listOfSongs[this.listIndex].url);
      }
    },
    // 下一首
    next() {
      if (this.listIndex != -1 && this.listOfSongs.length > 1) {
        if (this.listIndex < this.listOfSongs.length - 1) {
          this.$store.commit("setListIndex", this.listIndex + 1);
        } else {
          this.$store.commit("setListIndex", 0);
        }
        this.toPlay(this.listOfSongs[this.listIndex].url);
      }
    },
    // 歌词页面
    toLysic() {
      this.$router.push({ path: `/lyric` });
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
    // 下载音乐
    download() {
      download(this.url)
        .then((res) => {
          let content = res.data;
          let eleLink = document.createElement("a");
          eleLink.download = `${this.artist}-${this.title}.mp3`;
          eleLink.style.display = "none";
          // 把字符内容转换为 blob 地址
          let blob = new Blob([content]);
          eleLink.href = URL.createObjectURL(blob);
          // 把链接地址添加到 document 中
          document.body.appendChild(eleLink);
          // 触发点击事件
          eleLink.click();
          // 移除新加的控件
          document.body.removeChild(eleLink);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 收藏
    collection() {
      if (this.loginIn) {
        let params = new URLSearchParams();
        params.append("userId", this.userId);
        params.append("type", 0);
        params.append("songId", this.id);
        setCollect(params)
          .then((res) => {
            if (res.code == 1) {
              this.$store.commit('setIsActive', true);
              this.notify("收藏成功", "success");
            } else if (res.code == 2) {
              this.$store.commit('setIsActive', false);
              this.notify("取消收藏成功", "success");
            } else if(res.code == 3){
              this.notify("取消收藏失败", "error");
            }else {
              this.notify("收藏失败", "error");
            }
          })
          .catch((err) => {
            console.log(err);
            this.notify("收藏失败", "error");
          });
      } else {
        this.notify("请先登录", "error");
      }
    },
    notify(title, type) {
      this.$notify({
        title: title,
        type: type,
      });
    },
  },
};
</script>

<style lang='scss' scoped>
@import "../assets/css/play-bar.scss";
</style>