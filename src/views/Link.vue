<template>
  <div type="flex">
    <div style="margin-bottom: 10px" :class="{'box-search':this.$store.state.windowOrPhone}">
      <div
          :class="{'box-window-search':this.$store.state.windowOrPhone,'box-phone-search':!this.$store.state.windowOrPhone}">
        <el-input suffix-icon="el-icon-search" size="small" placeholder="请输入要查找的链接名称"
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
        <el-button class="button-publish" type="primary" @click="handelNew()">新增</el-button>
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
      <el-table-column sortable prop="name" label="链接名称" min-width="120px">
      </el-table-column>
      <el-table-column prop="content" label="链接url" min-width="100px">
      </el-table-column>
      <el-table-column prop="user" label="提供者" min-width="100px">
      </el-table-column>
      <el-table-column prop="time" label="提供时间" min-width="100px">
      </el-table-column>
      <el-table-column label="操作" width="130px" fixed="right">
        <template slot-scope="scope">
          <div>
            <el-button size="mini" class="el-button-small" @click="handleEdit(scope.row)">编辑</el-button>
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

    <!--编辑用户信息弹窗-->
    <el-dialog :modal-append-to-body="false"
               :close-on-click-modal="false"
               title="链接信息" class="box-card" :visible.sync="dialogFormVisible"
               :width="this.$store.state.windowOrPhone?'60%':'80%'">
      <el-form
          :inline="false"
          class="demo-form-inline"
          label-width="100px"
      >
        <el-form-item label="链接名称">
          <el-input maxlength="20" style="width: 80%" v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="链接url">
          <el-input maxlength="50" style="width: 80%" v-model="form.content" autocomplete="off"></el-input>
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

    <!--二次确认弹窗-->
    <!--        删除单个用户信息-->
    <el-dialog
        :modal-append-to-body="false"
        title="提示"
        :visible.sync="delDialogVisible"
        :width="this.$store.state.windowOrPhone?'30%':'80%'">
      <span>确认删除当前链接？</span>
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
      <span>确认批量删除当前链接？</span>
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

export default {
  name: "Link",
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
      this.request.get("/official/link", {
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
      this.request.post("/official/3", this.form).then(res => {
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
    handelNew() {
      this.form = {}
      this.dialogFormVisible = true
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
      this.request.delete("official/" + this.delId).then(res => {
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
      this.request.post("official/del/batch/3", ids).then(res => {
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
  }
}
</script>

<style scoped>

</style>
