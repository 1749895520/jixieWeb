<template>
  <div type="flex">
    <el-card class="box-card box-opacity">
      <div class="search-input " :class="{'box-search':this.$store.state.windowOrPhone}">
        <div
            :class="{'box-window-search':this.$store.state.windowOrPhone,'box-phone-search':!this.$store.state.windowOrPhone}">
          <el-input suffix-icon="el-icon-search" size="small" placeholder="请输入要查找的名称"
                    v-model="name"></el-input>
        </div>
        <div
            :class="{'box-window-search':this.$store.state.windowOrPhone,'box-phone-search':!this.$store.state.windowOrPhone}"
            :style="{small:this.$store.state.windowOrPhone,big:!this.$store.state.windowOrPhone}">
          <el-button class="" type="primary" @click="load">搜索</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </div>
      </div>
      <div class="box-user-operation">
        <el-button type="primary" @click="handleAdd('');isNew = true">新增
          <i class="el-icon-circle-plus-outline ml-5"></i></el-button>
        <el-button type="danger" @click="delAllDialogVisible = true">批量删除<i class="el-icon-delete ml-5"></i>
        </el-button>
      </div>
      <el-table :data="tableData"
                highlight-current-row
                stripe
                row-key="id"
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
        <el-table-column sortable prop="name" label="名称" min-width="100px">
        </el-table-column>
        <el-table-column sortable prop="path" label="路径" min-width="100px">
        </el-table-column>
        <el-table-column sortable prop="pagePath" label="页面名称" min-width="100px">
        </el-table-column>
        <el-table-column label="图标" min-width="100px">
          <template slot-scope="scope">
            <i :class="scope.row.icon" class="icon-size"></i>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="100px">
        </el-table-column>
        <el-table-column label="操作" width="230px" fixed="right">
          <template slot-scope="scope">
            <div style="display: flex;justify-content: right">
              <el-button v-show="scope.row.pid===null" size="mini" class="el-button-small"
                         @click="handleAdd(scope.row.id);isNew = true">
                新增子菜单
              </el-button>
              <el-button size="mini" class="el-button-small" @click="handleEdit(scope.row);isNew = false">编辑</el-button>
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
               title="菜单信息" class="box-card" :visible.sync="dialogFormVisible"
               :width="this.$store.state.windowOrPhone?'30%':'80%'">
      <el-form
          :inline="false"
          class="demo-form-inline"
          label-width="80px"
          style="display: inline-block;width: 100%;margin-left: 20px"
      >
        <el-form-item label="id">
          <el-input v-model="form.id" style="width: 80%" autocomplete="off" :disabled="!isNew"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.name" style="width: 80%" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="form.path" style="width: 80%" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="页面名称">
          <el-input v-model="form.pagePath" style="width: 80%" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <template slot-scope="scope">
            <el-select clearable v-model="form.icon" placeholder="请选择icon" value="" style="width:80%">
              <el-option v-for="item in options" :key="item.name" :label="item.name" :value="item.value">
                <i :class="item.value" class="icon-size"/> {{ item.name }}
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" style="width: 80%" autocomplete="off"></el-input>
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
    <!--        删除单个菜单-->
    <el-dialog
        :modal-append-to-body="false"
        title="提示"
        :visible.sync="delDialogVisible"
        :width="this.$store.state.windowOrPhone?'30%':'80%'">
      <span>确认删除当前菜单？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="delDialogVisible = false">我再想想</el-button>
    <el-button type="primary" @click="this.doDel">确 定</el-button>
  </span>
    </el-dialog>
    <!--        批量删除菜单-->
    <el-dialog
        :modal-append-to-body="false"
        title="提示"
        :visible.sync="delAllDialogVisible"
        :width="this.$store.state.windowOrPhone?'30%':'80%'">
      <span>确认批量删除当前菜单？</span>
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
  name: "Menu",
  data() {
    return {
      tableData: [],
      serverIp: serverIp,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      id: 0,
      name: "",
      path: "",
      pagePath: "",
      icon: "",
      description: "",
      dialogFormVisible: false,
      delDialogVisible: false,
      delAllDialogVisible: false,
      exportDialogVisible: false,
      isLoading: true,
      delId: 0,
      multipleSelection: [],
      form: {},
      headerBg: 'headerBg',
      options: [],
      isNew: true,
      menuIds: [],
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
      this.request.get("/menu", {
        params: {
          id: this.id,
          name: this.name,
        }
      }).then(res => {
        this.tableData = res.data
        this.menuIds = []
        for (let i = 0; i < res.data.length; i++) {
          this.menuIds.push(res.data[i].id)
          if (res.data.children !== null) {
            for (let j = 0; j < res.data[i].children.length; j++) {
              this.menuIds.push(res.data[i].children[j].id)
            }
          }
        }
      })
    },
    save() {
      let isContain = false
      //  判断是否为新增菜单
      if (this.isNew) {
        //  判断新增菜单的id是否重复
        if (this.menuIds.includes(Number(this.form.id))) {
          isContain = true
        }
      }
      //  判断新增菜单的路径是否为空
      if (this.form.path === null || this.form.path === '' || typeof (this.form.path) === 'undefined') {
        this.form.path = '/'
      }
      if (!isContain) {
        this.request.post("menu/", this.form).then(res => {
          if (res.code === '200') {
            this.$message.success("保存成功")
            this.dialogFormVisible = false
          } else {
            this.$message.error("保存失败")
          }
          this.load()
        })
      } else {
        this.$message.error('当前id已经存在 (⊙ o ⊙)')
      }
    },
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true
      this.getIcon()
    },
    getIcon() {
      //  请求图标的数据
      this.request.get("/menu/icons").then(res => {
        this.options = res.data
      })
    },
    isDel(id) {
      this.delId = id
      this.delDialogVisible = true
    },
    doDel() {
      this.request.delete("menu/" + this.delId).then(res => {
        if (res.code === '200') {
          this.$message.success("删除成功")
          this.load()
        } else {
          this.$message.error("删除失败")
        }
        this.delDialogVisible = false
      })
    },
    doExport() {
      window.open("http://" + serverIp + ":9090/menu/export")
      this.exportDialogVisible = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    doDelAll() {
      let ids = this.multipleSelection.map(v => v.id)
      this.request.post("menu/del/batch", ids).then(res => {
        if (res.code === '200') {
          this.$message.success("批量删除成功")
          this.load()
        } else {
          this.$message.error("批量删除失败")
        }
        this.delAllDialogVisible = false
      })
    },
    reset() {
      this.id = 0
      this.name = ""
      this.path = ""
      this.pagePath = ""
      this.icon = ""
      this.description = ""
      this.load()
    },
    handleAdd(pid) {
      this.dialogFormVisible = true
      this.form = {}
      if (pid) {
        this.form.pid = pid
      }
      this.getIcon()
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
      if (row.children !== null) {
        return {
          backgroundColor: '#f0f9ff',
          fontSize: '14px',
        }
      } else {
        return {backgroundColor: '#e0f2fe'}
      }
    },
  }
}
</script>

<style scoped>

.search-input >>> .el-input__inner {
  background-color: #f0f9ff;
  border-color: #c7e5f9;
}
</style>
