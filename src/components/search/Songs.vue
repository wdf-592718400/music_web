<template>
    <div class="search-songs">
      <div v-if="listOfSongs.length == 0" class="zanwushuju">暂无数据</div>
        <album-content v-else :songList="listOfSongs"></album-content>
    </div>
</template>

<script>
import {mapGetters} from "vuex";
import {mixin} from "../../mixins/index";
import AlbumContent from "../AlbumContent";
export default {
  name: 'searchSongs',
  components:{
    AlbumContent
  },
  mixins: [mixin],
  computed:{
    ...mapGetters([
      'listOfSongs',
      'searchWord'
    ])
  },
  watch:{
    searchWord(){
    this.getSong();
    }
  },
  mounted(){
    this.getSong();
  }
}
</script>


<style lang="scss" scoped>
@import '../../assets/css/search-songs.scss';
.zanwushuju{
  margin-top: 10vh;
  text-align: center;
  font-size: 40px;
  font-weight: 800;
  color: #FF0000;
  height: 600px;
}
</style>