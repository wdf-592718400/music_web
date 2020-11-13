<template>
  <div>
    <div class="comment">
      <h2>评论</h2>
      <div class="comment-msg">
        <div class="comment-img">
          <img :src="attachImagUrl(avator)" />
        </div>
        <el-input
          class="comment-input"
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="textarea"
        ></el-input>
      </div>
      <el-button type="primary" class="sub-btn" @click="postComment"
        >评论</el-button
      >
    </div>
    <p>
      <label>精彩评论:</label
      ><span style="font-weight: 800; font-size: 20px; margin-left: 20px"
        >共 {{ commentList.length }} 条</span
      >
    </p>
    <hr />
    <ul class="popular" v-for="(item, index) in commentList" :key="index">
      <li>
        <div class="popular-img">
          <img :src="attachImagUrl(userPic[index])" />
        </div>
        <div class="popular-msg">
          <ul>
            <div
              style="border: 1px solid #ccc; border-radius: 5px; width: 20vw"
            >
              <li class="name">{{ username[index] }}</li>
              <li class="time">{{ parseTime(item.create_time) }}</li>
            </div>
            <li style="margin-top: 10px" class="content">{{ item.content }}</li>
          </ul>
        </div>
        <div id="up" class="up" ref="up" @click="postUp(item.id, item.up, index)">
          <svg class="icon" :class="{'upAfter':indexs.includes(index)}">
            <use xlink:href="#icon-zan"></use>
          </svg>
          {{ item.up }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mixin } from "../mixins/index";
import { setComment, getAllComment, getUserOfId, setLike } from "../api/index";
export default {
  name: "comment",
  mixins: [mixin],
  props: ["playId", "type"],
  computed: {
    ...mapGetters(["id", "loginIn", "userId", "avator"]),
  },
  data() {
    return {
      textarea: "", // 存放输入的评论内容
      commentList: [], // 存放评论内容的列表
      userPic: [], // 用户头像
      username: [], // 用户名
      indexs: [],
    };
  },
  mounted() {
    this.getComment();
  },
  methods: {
    // 提交评论
    postComment() {
      if (this.loginIn) {
        let params = new URLSearchParams();
        if (this.type == 0) {
          params.append("songId", this.playId);
        } else {
          params.append("songListId", this.playId);
        }
        params.append("userId", this.userId);
        params.append("type", this.type);
        params.append("content", this.textarea);
        setComment(params)
          .then((res) => {
            if (res.code == 1) {
              this.notify("评论成功", "success");
              this.textarea = '';
              this.getComment();
            } else {
              this.rank = null;
              this.notify("评论失败", "error");
            }
          })
          .catch((err) => {
            this.rank = null;
            this.notify("评论失败", "error");
          });
      } else {
        this.textarea = "";
        this.notify("请先登录", "warning");
      }
    },
    // 评论列表
    getComment() {
      getAllComment(this.type, this.playId)
        .then((res) => {
          this.commentList = res;
          if (res.length >= 1) {
            for (let i = 0; i < res.length; i++) {
              if (res[i].up_user_id != null) {
                for (let item of res[i].up_user_id.split(", ")) {
                  if (item == this.userId) {
                    this.indexs.push(i);
                  }
                }
              }
              this.getUser(res[i].user_id, i);
            }
          }
        })
        .catch((err) => {
          console.log(err);
          this.notify("评论加载出错", "error");
        });
    },
    // 获取用户信息
    getUser(id, index) {
      getUserOfId(id)
        .then((res) => {
          this.userPic.push(res.avator);
          this.username.push(res.username);
          this.userPic[index] = res.avator;
          this.username[index] = res.username;
        })
        .catch((err) => {
          console.log(err);
          this.notify("内部错误", "error");
        });
    },
    // 点赞
    postUp(id, up, index) {
      if (this.loginIn) {
        let params = new URLSearchParams();
        params.append("id", id);
        params.append("up", up + 1);
        params.append("upUserId", this.userId);
        setLike(params)
          .then((res) => {
            if (res.code == 1) {
              this.$refs.up[index].children[0].style.color = "#ED6800";
              this.getComment();
            } else if(res.code == 2){
              this.notify("您已经点过赞了!", "error");
            }else {
              this.notify("点赞失败", "error");
            }
          })
          .catch((err) => {
            console.log(err);
            this.notify("点赞失败", "error");
          });
      } else {
        this.notify("请先登录", "warning");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/css/comment.scss";
.upAfter{
  color: #ED6800;
}
</style>