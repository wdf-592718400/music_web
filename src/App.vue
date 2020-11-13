<template>
  <div id="app">
    <Herder/>
    <router-view class="music-content"/>
    <SongAudio/>
    <Aside/>
    <PlayBar/>
    <ScrollTop/>
    <TheFooter/>
  </div>
</template>

<script>
import Herder from './components/Header'
import ScrollTop from './components/ScrollTop'
import TheFooter from './components/TheFooter'
import SongAudio from './components/SongAudio'
import PlayBar from './components/PlayBar'
import Aside from './components/Aside'
export default {
  name: 'App',
  components:{
    Herder,
    ScrollTop,
    TheFooter,
    SongAudio,
    PlayBar,
    Aside
  }
}
</script>

<style lang='scss' scoped>
@import './assets/css/app.scss';
</style>
