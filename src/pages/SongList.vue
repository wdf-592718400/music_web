<template>
  <div class="song-list">
    <div class="song-list-header">
      <ul>
        <li v-for="(item, index) in songStyle" :key="index" @click="getSongListOfStyle(item.style)" :class="{active: item.style == activeStyle}">
          {{ item.style }}
        </li>
      </ul>
    </div>
    <div>
      <div v-if="albumDatas.length == 0" class="zanwushuju">暂无数据</div>
      <content-list v-else :contentList="songListDatas"></content-list>
      <div class="pagination juzhong">
        <el-pagination
          @current-change="handleCurrentChange"
          background
          layout="total, prev, pager, next"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="albumDatas.length"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import ContentList from "../components/ContentList";
import {
  getAllSongList,
  AllSongListStyle,
  getSongListOfLikeStyle,
} from "../api/index";
export default {
  name: "song-list",
  components: {
    ContentList,
  },
  data() {
    return {
      albumDatas: [], // 歌单数据
      pageSize: 10, // 一页有多少个
      currentPage: 1, // 当前页
      songStyle: [], // 歌单所有的风格
      activeStyle: '全部歌单',  // 当前选中歌单风格
    };
  },
  computed: {
    songListDatas() {
      return this.albumDatas.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
  },
  created() {
    this.getAllStyle();
  },
  mounted() {
    this.getSongListLists();
  },
  methods: {
    getSongListLists() {
      getAllSongList()
        .then((res) => {
          this.albumDatas = res;
          this.currentPage = 1;
        })
        .catch((err) => {
          console.log(err);
          this.notify("内部错误", "error");
        });
    },
    // 获取当前页
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    // 获取所有的风格分类
    getAllStyle() {
      AllSongListStyle()
        .then((res) => {
          let item = { style: "全部歌单" };
          res.unshift(item);
          this.songStyle = res;
        })
        .catch((err) => {
          console.log(err);
          this.notify("内部错误", "error");
        });
    },
    // 根据风格查询歌单
    getSongListOfStyle(style) {
      this.activeStyle = style;
      if(style == "全部歌单"){
        this.getSongListLists();
        return;
      }
      getSongListOfLikeStyle(style)
        .then((res) => {
          this.albumDatas = res;
          this.currentPage = 1;
        })
        .catch((err) => {
          console.log(err);
          this.notify("内部错误", "error");
        });
    },
    handleChangeView() {},
  },
};
</script>


<style lang="scss" scoped>
@import "../assets/css/song-list.scss";
.zanwushuju {
  text-align: center;
  font-size: 40px;
  font-weight: 800;
  color: #ff0000;
  height: 600px;
  margin-top: 10vh;
}
.juzhong {
  margin-left: 30vw;
}
</style>