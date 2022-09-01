<template>
  <div type="flex">
    <el-card class="box-card box-opacity">
      <div style="margin-bottom: 10px" :class="{'box-search':this.$store.state.windowOrPhone}">
        <div
            :class="{'box-window-search':this.$store.state.windowOrPhone,'box-phone-search':!this.$store.state.windowOrPhone}">
          <el-input suffix-icon="el-icon-search" size="small" placeholder="请输入要查找的博客标题"
                    v-model="name"></el-input>
        </div>
        <div
            :class="{'box-window-search':this.$store.state.windowOrPhone,'box-phone-search':!this.$store.state.windowOrPhone}"
            :style="{small:this.$store.state.windowOrPhone,big:!this.$store.state.windowOrPhone}">
          <el-button type="primary" @click="load">搜索</el-button>
          <el-button type="primary" @click="reset">刷新</el-button>
          <el-button type="danger" size="mini" @click="delAllDialogVisible = true">批量删除<i
              class="el-icon-delete"></i>
          </el-button>
        </div>
      </div>
      <el-table :data="tableData"
                highlight-current-row
                stripe
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                fit
                max-height="520"
                :cell-style="tableColor"
                v-loading="isLoading"
                :show-overflow-tooltip="true"
      >
        <el-table-column type="selection" width="55px">
        </el-table-column>
        <el-table-column sortable prop="id" label="ID" width="80px">
        </el-table-column>
        <el-table-column sortable prop="name" label="博客标题" min-width="120px">
        </el-table-column>
        <el-table-column prop="content" label="博客内容" min-width="100px">
          <template slot-scope="scope">
            <el-button size="mini" class="el-button-small" @click="view(scope.row.content)">查看内容</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="user" label="发布人" min-width="100px">
        </el-table-column>
        <el-table-column prop="time" label="发布时间" min-width="100px">
        </el-table-column>
        <el-table-column label="操作" width="130px" fixed="right">
          <template slot-scope="scope">
            <div>
              <el-button size="mini" class="el-button-small" @click="handleEdit(scope.row.id)">编辑</el-button>
              <el-button size="mini" type="danger" class="el-button-small" @click="isDel(scope.row.id)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="padding: 10px 0;justify-content: space-around">
        <el-pagination
            class="box-pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[5,10]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
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
          <span style="margin: 0 10px 0 10px">是否置顶</span>
          <el-switch
              v-model="form.top"
              active-color="#13ce66"
              inactive-color="#ff4949">
          </el-switch>
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

    <!--二次确认弹窗-->
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
    <!--        批量删除用户信息-->
    <el-dialog
        :modal-append-to-body="false"
        title="提示"
        :visible.sync="delAllDialogVisible"
        :width="this.$store.state.windowOrPhone?'30%':'80%'">
      <span>确认批量删除当前用户信息？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="delAllDialogVisible = false">我再想想</el-button>
    <el-button type="primary" @click="this.doDelAll">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import Manage from "@/components/Manage";
import {serverIp} from "../../public/config";
import axios from "axios";

export default {
  name: "Blog",
  data() {
    return {
      tableData: [],
      serverIp: serverIp,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      name: '',
      content: '',
      user: '',
      time: '',
      userId: '',
      dialogFormVisible: false,
      delDialogVisible: false,
      delAllDialogVisible: false,
      dialogViewVisible: false,
      isLoading: true,
      delId: 0,
      multipleSelection: [],
      form: {},
      viewContent: '',
    }
  },
  components: {
    Manage,
  },
  created() {
    //  请求分页查询数据
    this.load()
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  },
  methods: {
    load() {
      this.request.get("article/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.name,
          content: this.content,
          user: this.user,
          time: this.time,
          userId: this.userId,
        }
      }).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    save() {
      this.request.post("article/", this.form).then(res => {
        if (res.data) {
          this.$message.success("保存成功")
          this.dialogFormVisible = false
        } else {
          this.$message.error("保存失败")
        }
        this.load()
      })
    },
    view(content) {
      this.viewContent = content
      this.dialogViewVisible = true
    },
    handleEdit(id) {
      let routerGoto = this.$router.resolve('/center/publish/blog?id=' + id)
      window.open(routerGoto.href, '_blank');
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    doDelAll() {
      let ids = this.multipleSelection.map(v => v.id)
      this.request.post("article/del/batch", ids).then(res => {
        if (res.data) {
          this.$message.success("批量删除成功")
          this.load()
        } else {
          this.$message.error("批量删除失败")
        }
        this.delAllDialogVisible = false
      })
    },
    reset() {
      this.name = ''
      this.content = ''
      this.user = ''
      this.time = ''
      this.userId = 0
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
    tableColor({row, rowIndex}) {
      if (rowIndex % 2 === 0) {
        return {
          backgroundColor: '#f0f9ff',
          fontSize: '13px'
        }
      } else {
        return {
          backgroundColor: '#e0f2fe',
          fontSize: '13px'
        }
      }
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

</style>
