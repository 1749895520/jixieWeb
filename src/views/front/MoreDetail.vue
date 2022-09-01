<template>
  <div>
    <el-row id="main" :gutter="10" style="margin-top: 20px">
      <el-col :span="6" v-if="isfixTab && this.$store.state.windowSize==='lg'"
              style="border: 1px solid transparent"></el-col>
      <el-col :xs="24" :sm="10" :md="10" :lg="6">
        <el-card style="margin-bottom: 10px"
                 :class="{ 'fixed front-blog-person':isfixTab && this.$store.state.windowSize==='lg'}">
          <div class="front-name">
            <i class="el-icon-blue-4 front-name-icon"></i>
            <span class="front-name-title">目录</span>
          </div>
          <div style="margin: 20px;display: flex;justify-content: center;flex-direction: column;text-align: center">
            <div class="menu-item">
              <i class="el-icon-blue-point icon-point"></i>
              <span class="menu-title" @click="change('1')" :class="{'isFocus':menuType==='1'}">通知公告</span>
            </div>
            <div class="menu-item">
              <i class="el-icon-blue-point icon-point"></i>
              <span class="menu-title" @click="change('2')" :class="{'isFocus':menuType==='2'}">
                协会动态</span>
            </div>
            <div class="menu-item">
              <i class="el-icon-blue-point icon-point"></i>
              <span class="menu-title" @click="change('3')" :class="{'isFocus':menuType==='3'}">
                友情链接</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="14" :md="14" :lg="18">
        <el-card style="min-height: 100vh">
          <div class="front-name">
            <i class="el-icon-blue-6 front-name-icon"></i>
            <span class="front-name-title">内容</span>
          </div>
          <div class="front-UserBox">
            <div class="pd-10 front-blog-eachUser">
              <i v-if="this.$store.state.windowSize!=='xs'" class="el-icon-my-calendar mr-1"></i>
              <span v-if="this.$store.state.windowSize!=='xs'">{{ official.name }}</span>
              <i class="el-icon-my-user ml-5 mr-1"></i>
              <span>{{ official.user }}</span>
              <i class="el-icon-my-time ml-5 mr-1"></i>
              <span>{{ official.time }}</span>
            </div>
          </div>
          <mavon-editor
              style="box-shadow: none;  background-color: #fff;padding: 0"
              class="md front-blog-main"
              :value="official.content"
              :subfield="false"
              :default-open="'preview'"
              :toolbars-flag="false"
              :scroll-style="true"
              :ishljs="true"
              ref="official"
          />
          <el-card v-if="menuType==='2'" class="front-blog-comment-box">
            <div class="front-name">
              <i class="el-icon-blue-7 front-name-icon"></i>
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
                  <el-image v-if="item.avatarUrl" :src="item.avatarUrl" class="front-blog-comment-avatar"></el-image>
                  <i v-else class="el-icon-avatar front-blog-comment-avatar"></i>
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
                  <el-image v-if="item.avatarUrl" :src="item.avatarUrl" class="front-blog-comment-avatar"></el-image>
                  <i v-else class="el-icon-avatar front-blog-comment-avatar"></i>
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
                        <el-image v-if="subItem.avatarUrl" :src="subItem.avatarUrl"
                                  style="width: 40px;height: 40px;border-radius: 50%"></el-image>
                        <i v-else class="el-icon-avatar" style="width: 40px;height: 40px;border-radius: 50%"></i>
                        <div style="display: flex;flex-direction: column;margin-left: 10px;max-width: 80%">
                          <div style="color: gray">{{ subItem.nickname }}<span v-if="$store.state.windowSize!=='xs'">
                          {{ subItem.time }}</span></div>
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
                            <el-image v-if="sonItem.avatarUrl" :src="sonItem.avatarUrl"
                                      style="width: 30px;height: 30px;border-radius: 50%;margin-left: 20px"></el-image>
                            <i v-else class="el-icon-avatar"
                               style="width: 30px;height: 30px;border-radius: 50%;margin-left: 20px"></i>
                            <div style="display: flex;flex-direction: column;margin-left: 10px;max-width: 80%">
                              <div style="color: gray">
                                {{ sonItem.nickname }}
                                <span style="font-weight: bold;color: #000">回复</span>
                                {{ getReplyName(sonItem.replyId, sonItem) }}
                                <span v-if="$store.state.windowSize!=='xs'"> {{ sonItem.time }}</span>
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
import Storage from "../../../public/storage";

let storage = new Storage()
export default {
  name: "MoreDetail",
  data() {
    return {
      user: storage.getItem("user") ? storage.getItem('user') : {},
      isfixTab: false,
      menuType: '',
      official: {},
      commentForm: {},
      comments: [],
      userId: 0,
      officialId: this.$route.query.id,
      delDialogVisible: false,
      dialogFormVisible: false,
      activeName: '',
      replyName: '',
    }
  },
  created() {
    this.load()
    this.loadComment()
    this.$store.state.frontPath = '/front/more?id=1'
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
      this.request.get("official/" + this.officialId).then(res => {
        this.official = res.data
        this.userId = res.data.userId
        this.menuType = this.official.type + ''
      })
    },
    loadComment() {
      this.request.get("comment/tree/getNews/" + this.officialId).then(res => {
        this.comments = res.data
      })
    },
    change(id) {
      this.$router.push('/front/more?id=' + id)
    },
    handleTabFix() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      let offsetTop = document.querySelector('#main').offsetTop
      scrollTop > offsetTop + 120 ? this.isfixTab = true : this.isfixTab = false
    },
    save() {
      if (!this.user.id) {
        this.$message.warning('请登录后再操作[○･｀Д´･ ○]')
      } else {
        this.commentForm.articleId = this.officialId
        if (this.commentForm.contentReply) {
          this.commentForm.content = this.commentForm.contentReply
        }
        this.request.post("comment/postNews", this.commentForm).then(res => {
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
      }
    },
    handelReply(id) {
      this.commentForm = {pid: id}
      this.dialogFormVisible = true
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
.front-blog-person {
  top: 80px;
  left: 11.2%;
  width: 19%;
}

.menu-item {
  margin-bottom: 5px;
  background-color: #f0f0f0;
  height: 30px;
  padding-top: 3px;
}

.icon-point {
  margin-right: 5px;
}

.menu-title {
  margin-right: 20px;
  cursor: pointer;
}

.menu-title:hover {
  color: #006ED7;
}

.isFocus {
  font-weight: bold;
  color: #006ED7;
}

.front-blogCard >>> .el-card__body {
  padding: 0;
}

.front-blogTitle {
  margin: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.front-TitleBox {
  margin: 10px 20px 10px 20px;
}


.front-blog-eachName {
  text-align: center;
}

.front-blog-main {
  min-height: 80vh;
}

.icon-point {
  margin-right: 5px;
}

.front-pagination >>> button.btn-prev {
  background-color: #fff;
}

.front-pagination >>> button.btn-next {
  background-color: #fff;
}

.front-pagination >>> li.number {
  background-color: #fff;
}

.front-pagination >>> li.number.active {
  background-color: #fff;
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
