<template>
  <div class="song-list-album">
    <div class="album-slide">
      <div class="album-img">
        <img :src="attachImagUrl(songList.pic)" />
      </div>
      <div class="album-info">
        <h2>简介</h2>
        <span>
          {{ songList.introduction }}
        </span>
      </div>
    </div>
    <div class="album-content">
      
      
      <div class="album-title">
        <p>{{ songList.title }}<el-button style="float: right;" type="primary" @click="$router.go(-1)">返回</el-button></p>
      </div>
      <div class="album-score">
        <div>
          <h3>歌单评分:</h3>
          <div>
            <el-rate v-model="average" disabled></el-rate>
          </div>
        </div>
        <span>{{ average * 2 }}</span>
        <div>
          <h3>评价:</h3>
          <div @click="setRankNum">
            <el-rate v-model="rank" allow-half show-text></el-rate>
          </div>
        </div>
      </div>
      <div class="songs-body">
        <album-content :songList="listOfSongs">
          <template slot="title">歌单</template>
        </album-content>
        <Comment :playId="songListId" :type="1" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mixin } from "../mixins/index";
import {
  listSongOfSongListId,
  songOfSongId,
  setRank,
  getRankOfSongListId,
} from "../api/index";
import AlbumContent from "../components/AlbumContent";
import Comment from "../components/Comment";
export default {
  mixins: [mixin],
  name: "song-list-album",
  components: {
    AlbumContent,
    Comment,
  },
  data() {
    return {
      songLists: [], // 歌曲列表
      songList: {}, // 单个歌单信息
      songListId: "", // 歌单 ID
      average: 0, // 平均分
      rank: 0, // 提交评价的分数
    };
  },
  computed: {
    ...mapGetters(["listOfSongs", "tempList", "loginIn", "userId"]),
  },
  created() {
    this.songListId = this.$route.params.id;
    this.getSongId();
    this.getRank(this.songListId);
    this.songList = this.tempList;
  },
  methods: {
    getSongId() {
      listSongOfSongListId(this.songListId)
        .then((res) => {
          for (let item of res) {
            this.getSongListOfId(item.song_id);
          }
          this.$store.commit("setListOfSongs", this.songLists);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getSongListOfId(id) {
      songOfSongId(id)
        .then((res) => {
          this.songLists.push(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getRank(id) {
      getRankOfSongListId(id)
        .then((res) => {
          this.average = res / 2;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setRankNum() {
      if (this.loginIn) {
        let params = new URLSearchParams();
        params.append("songListId", this.songListId);
        params.append("consumerId", this.userId);
        params.append("score", this.rank * 2);
        setRank(params)
          .then((res) => {
            if (res.code == 1) {
              this.notify("评分成功", "success");
              this.getRank(this.songListId);
            } else {
              this.rank = null;
              this.notify("评分失败", "error");
            }
          })
          .catch((err) => {
            this.rank = null;
            this.notify("您已经评价过了!", "error");
          });
      } else {
        this.rank = null;
        this.notify("请先登录", "warning");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/css/song-list-album.scss";
</style>