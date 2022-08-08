<template>
  <div>
    <el-row id="main" :gutter="10">
      <!--      占位    -->
      <el-col :xs="4" :sm="8" :md="8" :lg="0" style="border: 1px solid transparent"></el-col>
      <!--      占位    -->
      <el-col :span="4" v-if="isfixTab && this.$store.state.windowSize==='lg'"
              style="border: 1px solid transparent"></el-col>
      <el-col :xs="16" :sm="8" :md="8" :lg="4"
              style="margin-bottom: 10px"
              :class="{ 'fixed front-blogDetail-person':isfixTab && this.$store.state.windowSize==='lg'}">
        <!--        博客作者  -->
        <el-card>
          <span>
            <img v-if="this.blogUser.avatarUrl!==''" :src="this.blogUser.avatarUrl"
                 alt=""
                 class="front-blogUser-avatar"/>
            <img
                v-else
                :src="'http://'+serverIp+':9090/file/avatar/avatar.png'"
                class="front-blogUser-avatar"
                alt="">
          </span>
          <span class="front-blogUser-username">{{ blogUser.nickname }}</span>
          <el-divider/>
          <div class="front-blogUser-information">
            <div class="front-blogUser-each-information">专业：{{ blogUser.speciality }}</div>
            <div class="front-blogUser-each-information">班级：{{ blogUser.gradeClass }}</div>
            <div class="front-blogUser-each-information">故乡：{{ blogUser.address }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="20">
        <el-card class="front-blogCard">
          <div class="front-name" style="margin: 20px">
            <span class="front-name-title">博客内容</span>
          </div>
          <div class="front-blogTitle">
            <div class="front-TitleBox">
              <h1 class="front-blog-eachName">{{ blog.name }}</h1>
            </div>
            <div class="front-UserBox">
              <div class="pd-10 front-blog-eachUser">
                <i class="el-icon-my-user mr-1"></i>
                <span>{{ blog.user }}</span>
                <i class="el-icon-my-time ml-5 mr-1"></i>
                <span>{{ blog.time }}</span>
              </div>
            </div>
          </div>
          <mavon-editor
              class="md front-blog-main"
              :value="blog.content"
              :subfield="false"
              :default-open="'preview'"
              :toolbars-flag="false"
              :scroll-style="true"
              :ishljs="true"
              ref="blog"
          />
        </el-card>
        <el-card class="front-blog-comment-box">
          <div class="front-name">
            <span class="front-name-title">评论内容</span>
          </div>
          <div class="front-blog-comment-input">
            <el-input
                :autosize="{ minRows: 4,maxRows: 4}"
                type="textarea"
                placeholder="请输入内容"
                resize="none"
                maxlength="100"
                show-word-limit
                style="font-size: 15px;font-weight: bold"
                v-model="commentForm.content"></el-input>
          </div>
          <div style="margin: 20px 20px 20px 20px;text-align: right">
            <el-button type="primary" @click="save">
              评论
            </el-button>
          </div>
          <div class="front-blog-comment-title">
            评论列表：
          </div>
          <div v-for="item in comments" :key="item.id" class="front-blog-comment-father">
            <!--      时间      -->
            <div class="front-blog-comment-time">{{ item.time }}</div>
            <!--     别人评论       -->
            <div v-if="item.userId!==user.id" style="display: flex">
              <!--          头像    -->
              <div class="front-blog-comment-avatar-box">
                <el-image :src="item.avatarUrl" class="front-blog-comment-avatar"></el-image>
              </div>
              <!--            内容-->
              <div class="front-blog-comment-content-box">
                <div class="front-blog-comment-nickname">{{ item.nickname }}</div>
                <div style="display: flex">
                  <div class="triangle"></div>
                  <div class="box">
                    <span class="front-blog-comment-content">{{ item.content }}</span>
                  </div>
                </div>
              </div>
            </div>
            <!--     自己评论       -->
            <div v-else style="display: flex;justify-content: right">
              <!--            内容-->
              <div class="front-blog-comment-content-box">
                <div class="front-blog-comment-nickname-my">{{ item.nickname }}</div>
                <div style="display: flex;justify-content: right">
                  <div class="box-my">
                    <span class="front-blog-comment-content">{{ item.content }}</span>
                  </div>
                  <div class="triangle-my"></div>
                </div>
              </div>
              <!--          头像    -->
              <div class="front-blog-comment-avatar-box-my">
                <el-image :src="item.avatarUrl" class="front-blog-comment-avatar"></el-image>
              </div>
            </div>
            <!--            操作    -->
            <div class="front-blog-comment-reply-box">
              <el-button type="text" class="front-blog-comment-reply" @click="handelReply(item.id)">回复</el-button>
              <el-button v-if="item.userId===user.id" type="text" class="front-blog-comment-delete"
                         @click="isDel(item.id)">删除
              </el-button>
            </div>
            <!--            评论回复      -->
            <el-collapse class="front-blog-collapse" v-model="activeName" accordion v-if="item.children.length">
              <el-collapse-item title="展开回复" :name="item.id">
                <div v-for="subItem in item.children" :key="subItem.id">
                  <div style="flex: 1;font-size: 14px;padding: 5px 0;line-height: 25px;border-bottom: 1px solid #aaa">
                    <div style="display: flex">
                      <el-image :src="subItem.avatarUrl" style="width: 40px;height: 40px;border-radius: 50%"></el-image>
                      <div style="display: flex;flex-direction: column;margin-left: 10px;max-width: 80%">
                        <div style="color: gray">{{ subItem.nickname }} {{ subItem.time }}</div>
                        <div class="front-blog-comment-content">{{ subItem.content }}</div>
                      </div>
                    </div>
                    <!--            操作    -->
                    <div style="display: flex;justify-content: right">
                      <el-button type="text" class="front-blog-comment-reply" @click="handelReply(subItem.id)">回复
                      </el-button>
                      <el-button v-if="subItem.userId===user.id" type="text"
                                 class="front-blog-comment-delete"
                                 @click="isDel(subItem.id)">删除
                      </el-button>
                    </div>
                    <div v-for="sonItem in subItem.children" :key="sonItem.id">
                      <div
                          style="flex: 1;font-size: 14px;padding: 5px 0;line-height: 25px">
                        <div style="display: flex;margin-top: -10px;margin-left: 20px">
                          <el-image :src="sonItem.avatarUrl"
                                    style="width: 30px;height: 30px;border-radius: 50%;margin-left: 20px"></el-image>
                          <div style="display: flex;flex-direction: column;margin-left: 10px;max-width: 80%">
                            <div style="color: gray">
                              {{ sonItem.nickname }}
                              <span style="font-weight: bold;color: #000">回复</span>
                              {{ getReplyName(sonItem.replyId, sonItem) }} {{ sonItem.time }}
                            </div>
                            <div class="front-blog-comment-content">{{ sonItem.content }}</div>
                          </div>
                        </div>
                        <!--            操作    -->
                        <div style="display: flex;justify-content: right">
                          <el-button type="text" class="front-blog-comment-reply" @click="handelReply(subItem.id)">回复
                          </el-button>
                          <el-button v-if="sonItem.userId===user.id" type="text"
                                     class="front-blog-comment-delete"
                                     @click="isDel(sonItem.id)">删除
                          </el-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!--        删除单个用户信息-->
    <el-dialog
        :modal-append-to-body="false"
        title="提示"
        :visible.sync="delDialogVisible"
        :width="this.$store.state.windowOrPhone?'30%':'80%'">
      <span>确认删除当前评论？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="delDialogVisible = false">我再想想</el-button>
    <el-button type="primary" @click="this.doDel">确 定</el-button>
  </span>
    </el-dialog>
    <!--    回复评论  -->
    <el-dialog :modal-append-to-body="false"
               title="回复" class="box-card" :visible.sync="dialogFormVisible"
               :width="this.$store.state.windowOrPhone?'50%':'80%'">
      <el-form>
        <el-form-item label="回复内容">
          <div class="front-blog-comment-input">
            <el-input
                :autosize="{ minRows: 4,maxRows: 4}"
                type="textarea"
                placeholder="请输入内容"
                resize="none"
                maxlength="100"
                show-word-limit
                style="font-size: 15px;font-weight: bold"
                v-model="commentForm.contentReply"></el-input>
          </div>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="12" style="display: flex;justify-content: right">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
          </el-col>
          <el-col :span="12" style="display: flex;justify-content: left">
            <el-button type="primary" @click="save">确 定</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {serverIp} from "../../../public/config";

export default {
  name: "BlogDetail",
  data() {
    return {
      articleId: this.$route.query.id,
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      blog: {},
      userId: 0,
      blogUser: {},
      serverIp: serverIp,
      isfixTab: false,
      comments: [],
      commentForm: {},
      delId: 0,
      delDialogVisible: false,
      dialogFormVisible: false,
      activeName: '',
      replyName: '',
    }
  },
  created() {
    this.load()
    this.loadComment()
    setTimeout(() => {
      this.getUser()
    }, 200)
    this.$store.state.frontPath = '/front/blog'
  },
  mounted() {
    window.addEventListener('scroll', this.handleTabFix, true)
  },
  //离开当前组件前一定要清除滚动监听，否则进入其他路由会报错
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('scroll', this.handleTabFix, true)
    next()
  },
  methods: {
    load() {
      this.request.get("article/" + this.articleId).then(res => {
        this.blog = res.data
        this.userId = res.data.userId
      })
    },
    loadComment() {
      this.request.get("comment/tree/" + this.articleId).then(res => {
        this.comments = res.data
      })
    },
    getUser() {
      this.request.get('user/' + this.userId).then(res => {
        this.blogUser = res.data
      })
    },
    handleTabFix() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      let offsetTop = document.querySelector('#main').offsetTop
      scrollTop > offsetTop + 120 ? this.isfixTab = true : this.isfixTab = false
    },
    handelReply(id) {
      this.commentForm = {pid: id}
      this.dialogFormVisible = true
    },
    save() {
      if (!this.user.id) {
        this.$message.warning('请登录后再操作[○･｀Д´･ ○]')
      }
      this.commentForm.articleId = this.articleId
      if (this.commentForm.contentReply) {
        this.commentForm.content = this.commentForm.contentReply
      }
      this.request.post("comment/", this.commentForm).then(res => {
        if (res.data) {
          this.$message.success("评论成功(*❦ω❦)")
          this.commentForm = {}
          this.loadComment()
        } else {
          this.$message.error("评论失败o(╥﹏╥)o")
        }
        this.dialogFormVisible = false
        this.load()
      })
    },
    isDel(id) {
      this.delId = id
      this.delDialogVisible = true
    },
    doDel() {
      this.request.delete("comment/" + this.delId).then(res => {
        if (res.data) {
          this.$message.success("删除成功(*^▽^*)")
          this.load()
        } else {
          this.$message.error("删除失败o(╥﹏╥)o")
        }
        this.delDialogVisible = false
        this.loadComment()
      })
    },
    getReplyName(replyId, item) {
      this.request.get('user/' + replyId).then(res => {
        item.replyName = res.data.nickname
      })
      return item.replyName
    }
  }
}
</script>

<style scoped>
.front-blogUser-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  margin: auto;
}

.front-blogUser-username {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: -10px;
}

.front-blogUser-information {
  color: #aaa;
  font-size: 14px;
  margin: auto;
}

.front-blogUser-each-information {
  margin: auto auto 5px auto;
  padding-left: 10px;
}

.front-blogCard >>> .el-card__body {
  padding: 0;
}

.front-blogTitle {
  margin: 20px;
  border: 1px solid #f0f0f0;
}

.front-TitleBox {
  margin: 10px 20px 10px 20px;
}

.front-UserBox {
  padding: 0 10px 0 10px;
  background-color: #f8f8f8;
}

.front-blog-eachUser {
  width: 100%;
  display: flex;
  justify-content: right;
  font-size: 14px;
  color: #aaa;
}

.front-blog-main {
  min-height: 80vh;
}

.front-blogDetail-person {
  top: 80px;
  width: 13%;
}

/*  评论  */
.front-blog-comment-box {
  margin-top: 10px;
}

.triangle {
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-right: 10px solid #f0f0f0;
  border-left: 10px solid transparent;
  border-bottom: 5px solid transparent;
  margin-left: -10px;
  margin-top: 10px;
}

.triangle-my {
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-left: 10px solid #9eea6a;
  border-right: 10px solid transparent;
  border-bottom: 5px solid transparent;
  margin-right: -10px;
  margin-top: 10px;
}

.box {
  background-color: #f0f0f0;
  max-width: 70%;
  min-height: 50px;
  margin-top: 5px;
  padding: 10px;
  border: 0;
  border-radius: 5px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
}

.box-my {
  background-color: #9eea6a;
  max-width: 70%;
  min-height: 50px;
  margin-top: 5px;
  padding: 10px;
  border: 0;
  border-radius: 5px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
}

.front-blog-comment-title {
  padding: 20px 0 10px 10px;
  font-size: 16px;
  font-weight: bold;
  border-top: 1px solid #dcdfe6;
}

.front-blog-comment-input {
  padding-top: 10px;
}

.front-blog-comment-father {
  border-bottom: 1px solid #f0f0f0;
  padding: 10px 10px 10px 10px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
}

.front-blog-comment-time {
  height: 25px;
  text-align: center;
  color: #aaa;
  font-size: 10px;
}

.front-blog-comment-avatar-box {
  width: 50px;
  margin-left: 20px;
  text-align: center;
}

.front-blog-comment-avatar-box-my {
  width: 50px;
  text-align: center;
  margin-right: 20px;
  justify-content: right;
}

.front-blog-comment-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.front-blog-comment-content-box {
  flex: 1;
}

.front-blog-comment-nickname {
  display: block;
  color: gray;
  font-size: 14px;
  margin-left: 10px;
}

.front-blog-comment-nickname-my {
  display: flex;
  color: gray;
  margin-right: 10px;
  font-size: 14px;
  justify-content: right;
}

.front-blog-comment-content {
  word-wrap: break-word;

  word-break: break-all;

  overflow: hidden;
}

.front-blog-comment-reply-box {
  margin: 10px 10px;
  text-align: right;
}

.front-blog-comment-reply {

}

.front-blog-comment-delete {
  color: red;
}

.front-blog-collapse {
  border-top: 1px solid transparent;
}

.front-blog-collapse >>> .el-collapse-item__arrow {
  width: 10px;
  margin: 0 10px 0 5px;
}

.front-blog-collapse >>> .el-collapse-item__header {
  background-color: #fff;
  font-size: 14px;
  font-weight: normal;
  cursor: pointer;
  height: 20px;
  display: flex;
  justify-content: center;
}

.front-blog-collapse >>> .el-collapse-item__content {
  background-color: #f0f0f0;
  border: 1px solid #f0f0f0;
  padding: 10px 10px;
}

.front-blog-collapse >>> .el-collapse-item__wrap {
  border-bottom: 1px solid transparent;
}

</style>
