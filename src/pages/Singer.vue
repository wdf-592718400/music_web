<template>
  <div class="singer">
    <div class="singer-header">
      <ul>
        <li v-for="(item, index) in singerSex" :key="index" @click="getSingerListOfSex(item.sex)" :class="{active: returnClassifyOfSex(item.sex) == activeSex}">
          {{ returnClassifyOfSex(item.sex) }}
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
  getAllSinger,
  getSingerOfSex
} from "../api/index";
export default {
  name: "song-list",
  components: {
    ContentList,
  },
  data() {
    return {
      albumDatas: [], // 歌手数据
      pageSize: 10, // 一页有多少个
      currentPage: 1, // 当前页
      singerSex: [
        {"sex": 4},
        {"sex": 0},
        {"sex": 1},
        {"sex": 2},
        {"sex": 3},
      ], // 歌手所有的分类
      activeSex: '全部歌手',  // 当前选中歌手分类
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
  mounted() {
    this.getSingerLists();
  },
  methods: {
    getSingerLists() {
      getAllSinger()
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
    // 根据歌手分类查询歌手
    getSingerListOfSex(sex) {
      this.activeSex = this.returnClassifyOfSex(sex);
      if(this.returnClassifyOfSex(sex) == "全部歌手"){
        this.getSingerLists();
        return;
      }
      getSingerOfSex(sex)
        .then((res) => {
          this.albumDatas = res;
          this.currentPage = 1;
        })
        .catch((err) => {
          console.log(err);
          this.notify("内部错误", "error");
        });
    },
    // 将性别转换为歌手分类
    returnClassifyOfSex(sex) {
      if(sex == 0) return '女歌手';
      if(sex == 1) return '男歌手';
      if(sex == 2) return '组合歌手';
      if(sex == 3) return '其他歌手';
      if(sex == 4) return '全部歌手';
    },
  },
};
</script>


<style lang="scss" scoped>
@import "../assets/css/singer.scss";
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