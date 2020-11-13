<template>
  <div class="singer-album">
    <div class="album-slide">
      <div class="singer-img">
        <img :src="attachImagUrl(singer.pic)" />
      </div>
      <div class="info">
        <li>
          性别:
          <span v-show="singer.sex == 0">女</span>
          <span v-show="singer.sex == 1">男</span>
          <span v-show="singer.sex == 2">组合</span>
          <span v-show="singer.sex == 3">未知</span>
        </li>
        <li>生日: {{ singer.birth }}</li>
        <li>地区: {{ singer.location }}</li>
      </div>
    </div>
    <div class="album-content">
      <div class="intro">
        <h2>{{ singer.name }}<el-button style="float: right;" type="primary" @click="$router.go(-1)">返回</el-button></h2>
        <span>{{ singer.introduction }}</span>
      </div>
      <div class="content">
        <album-content :songList="songList">
          <template slot="title">歌曲</template>
        </album-content>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mixin } from "../mixins/index";
import { songOfSingerId } from "../api/index";
import AlbumContent from "../components/AlbumContent";
import Comment from "../components/Comment";
export default {
  mixins: [mixin],
  name: "singer-album",
  components: {
    AlbumContent,
  },
  data() {
    return {
      songList: [],
      singerId: "", // 歌手 ID
      singer: {}, // 歌手信息
    };
  },
  computed: {
    ...mapGetters(["listOfSongs", "tempList", "loginIn", "userId"]),
  },
  created() {
    this.singerId = this.$route.params.id;
    this.singer = this.tempList;
    this.getSongsOfSingerId(this.singerId);
    
  },
  methods: {
    getSongsOfSingerId(id) {
      songOfSingerId(id)
        .then((res) => {
          this.songList = res;
          this.$store.commit("setListOfSongs", this.songList);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/css/singer-album.scss";
</style>