<template>
  <div type="flex">
    <el-card class="box-card box-opacity">
      <div :class="{'box-search':this.$store.state.windowOrPhone}">
        <div
            :class="{'box-window-search':this.$store.state.windowOrPhone,'box-phone-search':!this.$store.state.windowOrPhone}">
          <el-input suffix-icon="el-icon-search" size="small" placeholder="请输入要查找的用户名"
                    v-model="username"></el-input>
        </div>
        <div
            :class="{'box-window-search':this.$store.state.windowOrPhone,'box-phone-search':!this.$store.state.windowOrPhone}">
          <el-input suffix-icon="el-icon-s-opportunity" placeholder="请输入要查找的昵称"
                    v-model="nickname"></el-input>
        </div>
        <div
            :class="{'box-window-search':this.$store.state.windowOrPhone,'box-phone-search':!this.$store.state.windowOrPhone}">
          <el-input suffix-icon="el-icon-message" placeholder="请输入要查找的专业"
                    v-model="speciality"></el-input>
        </div>

        <div
            :class="{'box-window-search':this.$store.state.windowOrPhone,'box-phone-search':!this.$store.state.windowOrPhone}">
          <el-input suffix-icon="el-icon-position" placeholder="请输入要查找的城市"
                    v-model="address"></el-input>
        </div>
        <div
            :class="{'box-window-search':this.$store.state.windowOrPhone,'box-phone-search':!this.$store.state.windowOrPhone}"
            :style="{small:this.$store.state.windowOrPhone,big:!this.$store.state.windowOrPhone}">
          <el-button class="" type="primary" @click="load">搜索</el-button>
          <el-button type="primary" @click="reset">刷新</el-button>
        </div>
      </div>
      <div class="box-user-operation">
        <el-button type="primary" @click="handleAdd">新增 <i class="el-icon-circle-plus-outline ml-5"></i></el-button>
        <el-button type="danger" @click="delAllDialogVisible = true">批量删除<i class="el-icon-delete ml-5"></i>
        </el-button>
        <el-upload :action="'http://'+serverIp+':9090/user/import'"
                   :show-file-list="false"
                   accept=".xlsx"
                   :on-success="handleExcelImportSuccess"
                   style="display: inline-flex;margin-left: 10px;margin-right: 10px">
          <el-button v-show="this.$store.state.windowOrPhone" type="primary">导入 <i class="el-icon-folder-add ml-5"></i>
          </el-button>
        </el-upload>
        <el-button v-show="this.$store.state.windowOrPhone" type="primary" @click="exportDialogVisible = true">导出 <i
            class="el-icon-bottom ml-5"></i>
        </el-button>
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
      >
        <el-table-column type="selection" width="55px">
        </el-table-column>
        <el-table-column sortable prop="id" label="ID" width="80px">
        </el-table-column>
        <el-table-column sortable prop="username" label="用户名" min-width="100px">
        </el-table-column>
        <el-table-column prop="role" label="角色" min-width="100px">
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" min-width="100px">
        </el-table-column>
        <el-table-column prop="speciality" label="专业" min-width="100px">
        </el-table-column>
        <el-table-column prop="gradeClass" label="班级" min-width="50px">
        </el-table-column>
        <el-table-column prop="address" label="故乡" min-width="100px">
        </el-table-column>
        <el-table-column label="操作" width="130px" fixed="right">
          <template slot-scope="scope">
            <div>
              <el-button size="mini" class="el-button-small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" class="el-button-small" @click="isDel(scope.row.id)">删除
              </el-button>
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
               title="用户信息" class="box-card" :visible.sync="dialogFormVisible"
               :width="this.$store.state.windowOrPhone?'30%':'80%'">
      <el-form
          :inline="false"
          class="demo-form-inline"
          label-width="60px"
          style="display: inline-block;width: 100%;margin-left: 20px"
      >
        <el-form-item label="用户名">
          <el-input style="width: 80%" :disabled="isDisable" v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select clearable v-model="form.role" placeholder="请选择角色" value="" style="width:80%">
            <el-option v-for="item in roles" :key="item.name" :label="item.name" :value="item.flag">
              <i :class="item.value" class="icon-size"/> {{ item.name }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input style="width: 80%" v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="专业">
          <el-input style="width: 80%" v-model="form.speciality" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级">
          <el-input style="width: 80%" v-model="form.gradeClass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="故乡">
          <el-input style="width: 80%" v-model="form.address" autocomplete="off"></el-input>
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
      <span>确认删除当前用户信息？</span>
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
    <!--    导出用户信息-->
    <el-dialog
        :modal-append-to-body="false"
        title="提示"
        :visible.sync="exportDialogVisible"
        :width="this.$store.state.windowOrPhone?'30%':'80%'">
      <span>确认导出当前用户信息？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="exportDialogVisible = false">我再想想</el-button>
    <el-button type="primary" @click="this.doExport">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import Manage from "@/components/Manage";
import {serverIp} from "../../public/config";

export default {
  name: "User",
  data() {
    return {
      tableData: [],
      serverIp: serverIp,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      username: "",
      nickname: "",
      speciality: "",
      gradeClass: "",
      address: "",
      dialogFormVisible: false,
      delDialogVisible: false,
      delAllDialogVisible: false,
      exportDialogVisible: false,
      isLoading: true,
      delId: 0,
      multipleSelection: [],
      form: {},
      headerBg: 'headerBg',
      isDisable: false,
      roles: '',
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
      this.request.get("user/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          username: this.username,
          nickname: this.nickname,
          speciality: this.speciality,
          gradeClass: this.gradeClass,
          address: this.address
        }
      }).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      })
      //  获取用户角色
      this.request.get("role").then(res => {
        this.roles = res.data
      })
    },
    save() {
      this.request.post("user/", this.form).then(res => {
        if (res.data) {
          this.$message.success("保存成功")
          this.dialogFormVisible = false
        } else {
          this.$message.error("保存失败")
        }
        this.load()
      })
    },
    handleEdit(row) {
      this.form = row
      this.isDisable = false
      this.dialogFormVisible = true
      this.load()
      this.isDisable = true
    },
    isDel(id) {
      this.delId = id
      this.delDialogVisible = true
    },
    doDel() {
      this.request.delete("user/" + this.delId).then(res => {
        if (res.data) {
          this.$message.success("删除成功")
          this.load()
        } else {
          this.$message.error("删除失败")
        }
        this.delDialogVisible = false
      })
    },
    doExport() {
      window.open("http://" + serverIp + ":9090/user/export")
      this.exportDialogVisible = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    doDelAll() {
      let ids = this.multipleSelection.map(v => v.id)
      this.request.post("user/del/batch", ids).then(res => {
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
      this.username = ""
      this.speciality = ""
      this.address = ""
      this.nickname = ""
      this.load()
    },
    handleAdd() {
      this.dialogFormVisible = true
      this.form = {}
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.load()
    },
    handleExcelImportSuccess() {
      this.$message.success("文件导入成功")
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
    }
  }
}
</script>

<style scoped>

</style>
