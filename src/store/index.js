import Vue from 'vue'
import Vuex from 'vuex'
import configure from './config'
import User from './user'
import Song from './song'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules:{
        configure,
        User,
        Song
    }
})

export default store