<template>
  <div>
    <el-card class="box-card box-opacity">
      <div class="box-blog-search">
        <div style="display: flex">
          <el-input
              suffix-icon="el-icon-search"
              class="front-search-input"
              size="small"
              placeholder="请输入要查找的博客标题"
              v-model="$store.state.frontBlogName"></el-input>
          <el-button class="front-search-button" type="primary" @click="load">搜索</el-button>
        </div>
        <div style="margin-left: 20px">
          <el-button class="button-reset" type="primary" @click="reset">重置搜索</el-button>
        </div>
        <div style="margin-left: 20px">
          <el-button class="button-publish" type="primary" @click="gotoPublish()">发布</el-button>
        </div>
      </div>
      <div class="front-blog-main">
        <div class="front-blog-each" v-for="(item,index) in tableData" :key="item.id">
            <span class="front-blog-eachName" @click="goto(item.id)">{{
                item.name
              }}</span>
          <div class="pd-10 front-blog-eachUser">
            <i class="el-icon-my-user mr-1"></i>
            <span>{{ item.user }}</span>
            <i class="el-icon-my-time ml-5 mr-1"></i>
            <span>{{ item.time }}</span>
          </div>
          <div class="box-blog-operation"
               v-if="$store.state.windowOrPhone">
            <el-button type="text" class="box-blog-operation-view" @click="view(item.content)">查看内容</el-button>
            <el-button type="text" class="box-blog-operation-edit" @click="handleEdit(item)">编辑</el-button>
            <el-button type="text" class="box-blog-operation-delete" @click="isDel(item.id)">删除</el-button>
          </div>
        </div>
      </div>
      <div style="padding: 10px 0;justify-content: space-around">
        <el-pagination
            class="box-pagination front-pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="total"
            v-show="this.$store.state.windowOrPhone">
        </el-pagination>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            class="box-pagination"
            background
            layout="prev, pager, next"
            :total="total"
            v-show="!this.$store.state.windowOrPhone">
        </el-pagination>
      </div>
    </el-card>

    <!--编辑用户信息弹窗-->
    <el-dialog :modal-append-to-body="false"
               :close-on-click-modal="false"
               title="博客信息" class="box-card" :visible.sync="dialogFormVisible"
               :width="this.$store.state.windowOrPhone?'80%':'90%'">
      <el-form
          :inline="false"
          class="demo-form-inline"
          label-width="60px"
      >
        <el-form-item label="标题">
          <el-input maxlength="50" style="width: 80%" v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <mavon-editor style="max-height: 40vh" class="box-opacity" ref="md" v-model="form.content" :ishljs="true"
                        @imgAdd="imgAdd"/>
        </el-form-item>
      </el-form>
      <el-row :gutter="10">
        <el-col :span="12" style="display: flex;justify-content: right">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </el-col>
        <el-col :span="12" style="display: flex;justify-content: left">
          <el-button type="primary" @click="save">确 定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!--    文章内容  -->
    <el-dialog :modal-append-to-body="false"
               title="博客预览" class="box-card" :visible.sync="dialogViewVisible"
               :width="this.$store.state.windowOrPhone?'80%':'90%'">
      <div>
        <mavon-editor
            class="md"
            :value="viewContent"
            :subfield="false"
            :default-open="'preview'"
            :toolbars-flag="false"
            :scroll-style="true"
            :ishljs="true"
            style="min-height: 60vh;max-height: 60vh"
        />
      </div>
    </el-dialog>
    <!--        删除单个用户信息-->
    <el-dialog
        :modal-append-to-body="false"
        title="提示"
        :visible.sync="delDialogVisible"
        :width="this.$store.state.windowOrPhone?'30%':'80%'">
      <span>确认删除当前博客？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="delDialogVisible = false">我再想想</el-button>
    <el-button type="primary" @click="this.doDel">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import {serverIp} from "../../public/config";

export default {
  name: "PersonBlog",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 5,
      content: '',
      user: '',
      userId: JSON.parse(localStorage.getItem('user')).id,
      time: '',
      isfixTab: false,
      delDialogVisible: false,
      dialogViewVisible: false,
      dialogFormVisible: false,
      viewContent: '',
      form: {},
    }
  },
  created() {
    this.load()
    this.reset()
  },
  methods: {
    load() {
      this.request.get("article/personPage", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          userId: this.userId,
          name: this.$store.state.frontBlogName,
          content: this.content,
          user: this.user,
          time: this.time
        }
      }).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    save() {
      if (this.form.name === null || this.form.name === '') {
        this.$message.error('文章标题不能为空！')
      } else if (this.form.content === '') {
        this.$message.error('文章内容不能为空！')
      } else {
        this.request.post("article/", this.form).then(res => {
          if (res.data) {
            this.$message.success("修改成功")
          } else {
            this.$message.error("修改失败")
          }
          this.reset()
          this.dialogFormVisible = false
        })
      }
    },
    view(content) {
      this.viewContent = content
      this.dialogViewVisible = true
    },
    goto(id) {
      let routerGoto = this.$router.resolve('/front/blogDetail?id=' + id)
      window.open(routerGoto.href, '_blank');
    },
    gotoPublish() {
      let routerGoto = this.$router.resolve('/center/publish/blog')
      window.open(routerGoto.href, '_blank');
    },
    reset() {
      this.$store.state.frontBlogName = ''
      this.content = ''
      this.user = ''
      this.time = ''
      this.load()
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.load()
    },
    handleEdit(row) {
      this.form = row
      this.dialogFormVisible = true
      this.load()
    },
    isDel(id) {
      this.delId = id
      this.delDialogVisible = true
    },
    doDel() {
      this.request.delete("article/" + this.delId).then(res => {
        if (res.data) {
          this.$message.success("删除成功")
          this.load()
        } else {
          this.$message.error("删除失败")
        }
        this.delDialogVisible = false
      })
    },
    //  绑定imgAdd event
    imgAdd(pos, $file) {
      let $vm = this.$refs.md
      //  第一步，将图片上传到服务器
      const formData = new FormData()
      formData.append('file', $file)
      axios({
        url: 'http://' + serverIp + ':9090/file/upload/blog',
        method: 'post',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'},
      }).then((res) => {
        //  第二步，将返回的url替换到文本原位置 ![...](./0) -> ![...](url)

        $vm.$img2Url(pos, res.data)
      })
    },
  }
}
</script>

<style scoped>
.box-blog-search {
  display: flex;
  justify-content: center;
  margin: 12px;
  border-radius: 20px 0 20px 0;
}

.front-search-input >>> .el-input__inner {
  border-radius: 20px 0 0 20px !important;
}

.front-search-button {
  border-radius: 0 20px 20px 0 !important;
}

.button-reset {
  border-radius: 20px;
}

.button-publish {
  border-radius: 20px;
  width: 100px;
}

.front-blog-each {
  padding: 20px 20px 0 20px;
  border-bottom: 1px solid #ccc;
  width: 100%;
}

.front-blog-each:hover {
  background-color: #c7e5f9 !important;
}

.front-blog-eachName {
  padding-left: 10px;
  font-size: 20px;
  color: #409eff;
  cursor: pointer;
  width: auto;
}

.front-blog-eachName:hover {
  color: #006ed7;
  text-decoration: underline 2px solid #006ed7;
}

.front-blog-eachUser {
  display: flex;
  justify-content: left;
  font-size: 14px;
  position: relative;
  top: 20px;
  color: gray;
}

.box-blog-operation {
  margin: 0 10px 0 10px;
  text-align: right;
  position: relative;
  z-index: 10;
}

.box-blog-operation-edit {

}

.box-blog-operation-delete {
  color: red;
}
</style>
