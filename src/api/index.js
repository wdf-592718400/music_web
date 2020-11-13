import Axios from 'axios';
import {get, post} from './http'


/*********************************************歌手相关 */
// 查询歌手
export const getAllSinger = () => get(`singer/allSinger`);
export const getSingerOfSex = (sex) => get(`singer/singerOfSex?sex=${sex}`);


/************************************************歌曲相关 */
// 查询歌曲
export const getAllSong = () => get(`song/allSong`);

// 根据歌曲名字模糊查询歌曲
export const likeSongOfName = (keywords) => get(`song/likeSongOfName?songName=${keywords}`);

// 根据歌手ID查询歌曲
export const songOfSingerId = (id) => get(`song/singer/detail?singerId=${id}`);

// 根据歌曲 ID 查询歌曲对象
export const songOfSongId = (id) => get(`song/detail?id=${id}`);

// 根据歌曲名获取歌曲 ID
export const songOfSongName = (songName) => get(`song/songOfSongName?songName=${songName}`);

/*********************************************歌单相关 */
// 查询歌单
export const getAllSongList = () => get(`song/list/allSongList`);
export const getSongListLikeStyle = (keywords) => get(`song/list/likeTitle?title=${keywords}`);
export const AllSongListStyle = () => get(`song/list/AllSongListStyle`);
export const getSongListOfLikeStyle = (style) => get(`song/list/likeStyle?style=${style}`);


/*********************************************歌单的歌曲相关 */
// 查询歌单
export const listSongOfSongListId = (songListId) => get(`list/song/detail?songListId=${songListId}`);


/*********************************************用户相关 */
export const getAllConsumer = () => get(`consumer/allConsumer`);
export const signUp = (params) => post(`consumer/add`, params);
export const loginIn = (params) => post(`consumer/login`, params);
export const getUserOfId = (id) => get(`consumer/selectByPrimaryKey?id=${id}`);
export const updateUser = (params) => post(`consumer/update`, params);



// 下载音乐
export const download = (url) => Axios({
    method: 'get',
    url: url,
    responseType: 'blob'
});


/*********************************************评价相关 */

export const setRank = (params) => post(`rank/add`, params);
export const getRankOfSongListId = (songListId) => get(`rank?songListId=${songListId}`);

/*********************************************评论相关 */
// 提交评论
export const setComment = (params) => post(`comment/add`, params);
// 点赞
export const setLike = (params) => post(`comment/like`, params);
// 返回当前歌单或歌曲的评论列表
export const getAllComment = (type, id) => {
    if(type == 0){
        // 歌曲
        return get(`comment/commentOfSongId?songId=${id}`);
    }else{
        // 歌单
        return get(`comment/commentOfSongListId?songListId=${id}`);
    }
}


/*********************************************收藏相关 */

export const setCollect = (params) => post(`collect/add`, params);
// 指定用户的收藏列表
export const getCollectOfUserId = (userId) => get(`collect/collectOfUserId?userId=${userId}`);

