<template>
  <div class="song-audio">
    <audio
      ref="player"
      :src="url"
      controls
      preload="true"
      @canplay="startPlay"
      @ended="ended"
      @timeupdate="timeUpdate"
    ></audio>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "song-audio",
  computed: {
    ...mapGetters([
      "listOfSongs", // 当前歌曲列表
      "isPlay", // 是否播放中
      "url", // 歌曲地址
      "id", // 歌曲 ID
      "curTime", // 当前音乐的播放位置
      "changeTime", // 指定播放时间
      "autoNext", // 是否自动播放下一首
      "volume", // 音量
    ]),
  },
  watch: {
    // 监听现在是什么状态
    isPlay() {
      this.togglePlay();
    },
    // 跳转到指定播放时间
    changeTime(){
        this.$refs.player.currentTime = this.changeTime;
    },
    // 改变音量
    volume(val){
        this.$refs.player.volume = val;
    }
  },
  methods: {
    // 获取链接后准备播放
    startPlay() {
      let player = this.$refs.player;
      this.$store.commit('setDuration', player.duration);
      // 开始播放
      player.play();
      this.$store.commit('setIsPlay', true);
    },
    // 播放完成之后触发
    ended() {
      this.$store.commit('setIsPlay', false);
      this.$store.commit('setCurTime', 0);
      this.$store.commit('setAutoNext', !this.autoNext);
    },
    // 开始, 暂停
    togglePlay() {
      let player = this.$refs.player;
      if (this.isPlay) {
        player.play();
      } else {
        player.pause();
      }
    },
    // 音乐播放的时候记录播放位置
    timeUpdate(){
        this.$store.commit('setCurTime', this.$refs.player.currentTime);
    }
  },
};
</script>

<style scoped>
.song-audio {
  display: none;
}
</style>