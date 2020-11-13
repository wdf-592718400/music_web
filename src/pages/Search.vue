<template>
    <div class="search">
        <el-button style="float: right; margin-top: 20px;" type="primary" @click="$router.go(-1)">返回</el-button>
        <nav class="searchList-nav" ref="change">
            <span :class="{isActive: toggle == 'Songs'}" @click="handelChangeView('Songs')">歌曲</span>
            <span :class="{isActive: toggle == 'SongLists'}" @click="handelChangeView('SongLists')">歌单</span>
        </nav>
        <component :is="currentView"></component>
    </div>
</template>

<script>
import searchSongs from '../components/search/Songs'
import searchSongLists from '../components/search/SongLists'
export default {
  name: 'search',
  components:{
      searchSongs,
      searchSongLists
  },
  data(){
      return{
          toggle: 'Songs',
          currentView: 'searchSongs'
      }
  },
  destroyed(){
      this.$store.commit("setSearchWord", '');
  },
  methods:{
      // 切换组件
      handelChangeView(component){
          this.currentView = 'search' + component;
          this.toggle = component;
      }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/search.scss";
</style>