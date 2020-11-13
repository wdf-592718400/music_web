<template>
  <div class="search-song-Lists">
    <div v-if="albumDatas.length == 0" class="zanwushuju">暂无数据</div>
    <content-list v-else :contentList="albumDatas"></content-list>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mixin } from "../../mixins/index";
import ContentList from "../ContentList";
import { getSongListLikeStyle } from "../../api/index";
export default {
  mixins: [mixin],
  name: "searchSongLists",
  components: {
    ContentList,
  },
  data() {
    return {
      albumDatas: [],
    };
  },
  computed: {
    ...mapGetters(["searchWord"]),
  },
  watch: {
    searchWord() {
      this.getSearchList();
    },
  },
  mounted() {
    this.getSearchList();
  },
  methods: {
    getSearchList() {
      if (!this.searchWord) {
        this.notify("输入的内容为空", "warning");
      } else {
        getSongListLikeStyle(this.searchWord)
          .then((res) => {
            if (res) {
              console.log(res.length == 0);
              this.albumDatas = res;
            } else {
              this.notify("暂无数据", "warning");
            }
          })
          .catch((err) => {
            console.log(err);
            this.notify("内部错误", "error");
          });
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import "../../assets/css/search-song-lists.scss";
.zanwushuju{
  text-align: center;
  font-size: 40px;
  font-weight: 800;
  color: #FF0000;
  height: 600px;
  margin-top: 10vh;
}
</style>