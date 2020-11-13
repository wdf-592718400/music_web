import { likeSongOfName, getCollectOfUserId } from "../api/index";
import { mapGetters } from "vuex";
export const mixin = {
    computed: {
        ...mapGetters(["isPlay", "loginIn", "userId", "id"]),
    },
    methods: {
        notify(title, type) {
            this.$notify({
                title: title,
                type: type
            })
        },
        // 获取图片地址
        attachImagUrl(srcUrl) {
            return srcUrl
                ? this.$store.state.configure.HOST + srcUrl
                : this.$store.state.configure.HOST + "/img/songListPic/songList.png";
        },
        // 根据歌曲名字模糊查询歌曲
        getSong() {
            if (!this.$route.query.keywords) {
                this.notify('请输入内容', 'warning');
                this.$store.commit('setListOfSongs', []);
            } else {
                likeSongOfName(this.$route.query.keywords).then(res => {
                    if (!res.length) {
                        this.$store.commit('setListOfSongs', []);
                        this.notify('暂无数据', 'warning');
                    } else {
                        this.$store.commit('setListOfSongs', res);
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
        },
        // 获取歌手名字
        replaceLName(val) {
            let arr = val.split('-');
            return arr[0];
        },
        // 获取歌名
        replaceFName(val) {
            let arr = val.split('-');
            return arr[1];
        },
        // 播放
        toPlay: function (id, url, pic, index, name, lyric) {
            this.$store.commit('setId', id);
            this.$store.commit('setUrl', this.$store.state.configure.HOST + url);
            this.$store.commit('setPicUrl', this.$store.state.configure.HOST + pic);
            this.$store.commit('setListIndex', index);
            this.$store.commit('setTitle', this.replaceFName(name));
            this.$store.commit('setArtist', this.replaceLName(name));
            this.$store.commit('setLyric', this.parseLyric(lyric));
            this.$store.commit('setIsPlay', true);
            this.$store.commit('setIsActive', false);
            if(this.loginIn){
                getCollectOfUserId(this.userId).then(res => {
                    for(let item of res){
                        if(item.song_id == this.id){
                            this.$store.commit('setIsActive', true);
                            break;
                        }
                    }
                })
            }

        },
        // 解析歌词
        parseLyric(text) {
            let lines = text.split('\n');
            let pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g;  // 分离出来时间部分
            let res = [];
            if (!(/\[.+\]/.test(text))) {
                return [[0, text]];
            }

            while (!pattern.test(lines[0])) {
                lines = lines.slice(1);
            }

            for (let line of lines) {
                let time = line.match(pattern);
                let value = line.replace(pattern, '');
                for (let item of time) {
                    let t = item.slice(1, -1).split(':');
                    if (value != '') {
                        res.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
                    }
                }
            }
            res.sort(function (a, b) {
                return a[0] - b[0];
            });
            return res;
        },
        // 解析时间
        parseTime(val) {
            return this.$moment(val).utcOffset(480).format('YYYY-MM-DD HH:mm:ss');
        }
    }
}