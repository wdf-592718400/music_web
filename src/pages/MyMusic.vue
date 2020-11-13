<template>
  <div class="my-music">
    <div class="album-slide">
      <div class="album-img">
        <img :src="attachImagUrl(avator)" />
      </div>
      <ul class="album-info">
        <li>用户名: {{ username }}</li>
        <li>性别: {{ userSex }}</li>
        <li>生日: {{ birth }}</li>
        <li>地区: {{ location }}</li>
      </ul>
    </div>
    <div class="album-content">
      <div class="album-title">个性签名: {{ introduction }}</div>
      <div class="songs-body">
        <album-content :songList="collectList">
          <template slot="title">我的收藏</template>
        </album-content>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mixin } from "../mixins/index";
import { getCollectOfUserId, songOfSongId, getUserOfId } from "../api/index";
import AlbumContent from "../components/AlbumContent";
export default {
  mixins: [mixin],
  name: "myMusic",
  components: {
    AlbumContent,
  },
  computed: {
    ...mapGetters(["listOfSongs", "tempList", "loginIn", "userId"]),
  },
  data() {
    return {
      avator: "", // 用户头像
      username: "", // 用户名
      userSex: "", // 用户性别
      birth: "", // 用户生日
      location: "", // 地区
      introduction: "", // 签名
      collection: [], // 收藏的歌曲列表
      collectList: [], // 收藏的歌曲列表(带歌曲详情)
    };
  },
  mounted() {
    this.getMsg(this.userId);
    this.getMyCollection(this.userId)
  },
  methods: {
    getMsg(userId) {
      getUserOfId(userId)
        .then((res) => {
          this.avator = res.avator;
          this.username = res.username;
          this.userSex = res.sex == 0 ? "女" : "男";
          this.birth = res.birth;
          this.location = res.location;
          this.introduction = res.introduction;
        })
        .catch((err) => {
          console.log(err);
          this.notify("获取用户信息失败!", "error");
        });
    },
    // 获取我的收藏
    getMyCollection(userId) {
      getCollectOfUserId(userId)
        .then((res) => {
          this.collection = res;
          for (let item of this.collection) {
            this.getSongsIdSongId(item.song_id);
          }
        })
        .catch((err) => {
          console.log(err);
          this.notify("获取用户收藏信息失败!", "error");
        });
    },
    // 根据歌曲 ID 获取歌曲信息
    getSongsIdSongId(id) {
      songOfSongId(id)
        .then((res) => {
          this.collectList.push(res);
        })
        .catch((err) => {
          console.log(err);
          this.notify("获取歌曲信息失败!", "error");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/css/my-music.scss";
</style>