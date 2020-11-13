<template>
<div class="home">
  <Swiper/>
  <div class="section" v-for="(item, index) in songsList" :key="index">
    <div class="section-title">{{item.name}}</div>
    <content-list :contentList="item.list"></content-list>
  </div>
</div>
</template>

<script>
import Swiper from "../components/Swiper"
import ContentList from './ContentList'
import {getAllSinger, getAllSongList} from '../api/index'
export default {
  name: 'home',
  components:{
    Swiper,
    ContentList
  },
  data () {
    return {
      songsList:[
        {name: "歌单", list: []},
        {name: "歌手", list: []},
      ]
    }
  },
  created(){
    this.getSongList();
    this.getSingerList();
  },
  methods:{
    getSongList(){  // 获取前 10 条歌单
      getAllSongList().then((res) => {
        this.songsList[0].list = res.slice(0, 10);
      }).catch((err) =>{
        console.log(err);
      })
    },
    getSingerList(){  // 获取前 10 名歌手
      getAllSinger().then((res) => {
        this.songsList[1].list = res.slice(0, 10);
      }).catch((err) =>{
        console.log(err);
      })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../assets/css/home.scss';
</style>
