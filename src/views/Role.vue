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
            :class="{'box-window-search':this.$store.state.windowOrPhone,'box-phone-search':!this.$store.state.windowOrPhone}">
          <el-input suffix-icon="el-icon-message" placeholder="请输入要查找的描述"
                    v-model="description"></el-input>
        </div>
        <div
            :class="{'box-window-search':this.$store.state.windowOrPhone,'box-phone-search':!this.$store.state.windowOrPhone}"
            :style="{small:this.$store.state.windowOrPhone,big:!this.$store.state.windowOrPhone}">
          <el-button class="" type="primary" @click="load">搜索</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </div>
      </div>
      <div class="box-user-operation">
        <el-button type="primary" @click="handleAdd">新增 <i class="el-icon-circle-plus-outline ml-5"></i></el-button>
        <el-button type="danger" @click="delAllDialogVisible = true">批量删除<i class="el-icon-delete ml-5"></i>
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
        <el-table-column sortable prop="name" label="名称" min-width="100px">
        </el-table-column>
        <el-table-column sortable prop="flag" label="唯一标识" min-width="100px">
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="100px">
        </el-table-column>
        <el-table-column label="操作" width="250px" fixed="right">
          <template slot-scope="scope">
            <div>
              <el-button size="mini" class="el-button-small" @click="selectMenu(scope.row.id)">菜单分配</el-button>
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
        <el-form-item label="名称">
          <el-col :span="20">
            <el-input :disabled="isDisable" v-model="form.name" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="唯一标识">
          <el-col :span="20">
            <el-input :disabled="isDisable" v-model="form.flag" autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="描述">
          <el-col :span="20">
            <el-input v-model="form.description" autocomplete="off"></el-input>
          </el-col>
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

    <!--    权限分配-->
    <el-dialog :modal-append-to-body="false"
               title="权限分配" class="box-card" :visible.sync="menuDialogVisible"
               :width="this.$store.state.windowOrPhone?'30%':'80%'">
      <div class="box-el-dialog">
        <el-tree
            :props="props"
            :data="menuData"
            show-checkbox
            ref="tree"
            node-key="id"
            :default-expanded-keys="expends"
            :default-checked-keys="checks">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span><i :class="data.icon"></i>{{ data.name }}</span>
        </span>
        </el-tree>
        <el-row :gutter="10">
          <el-col :span="12" style="display: flex;justify-content: right">
            <el-button @click="menuDialogVisible = false">取 消</el-button>
          </el-col>
          <el-col :span="12" style="display: flex;justify-content: left">
            <el-button type="primary" @click="saveRoleMenu()">确 定</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <!--二次确认弹窗-->
    <!--        删除单个用户信息-->
    <el-dialog
        :modal-append-to-body="false"
        title="提示"
        :visible.sync="delDialogVisible"
        :width="this.$store.state.windowOrPhone?'30%':'80%'">
      <span>确认删除当前权限信息？</span>
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
      <span>确认批量删除当前权限信息？</span>
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
  name: "role",
  data() {
    return {
      tableData: [],
      serverIp: serverIp,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      name: "",
      description: "",
      menuDialogVisible: false,
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
      menuData: [],
      props: {
        label: 'name',
      },
      expends: [],
      checks: [],
      roleId: 0,
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
      this.request.get("role/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.name,
          description: this.description,
        }
      }).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    save() {
      this.request.post("role/", this.form).then(res => {
        if (res.code === '200') {
          this.$message.success("保存成功")
          this.dialogFormVisible = false
          this.menuDialogVisible = false
        } else {
          this.$message.error("保存失败")
        }
        this.load()
      })
    },
    saveRoleMenu() {
      this.request.post("role/roleMenu/" + this.roleId,
          this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())).then(res => {
        if (res.code === '200') {
          this.menuDialogVisible = false
          if (this.roleId === 2 || this.roleId === 3) {
            this.$store.commit('logout')
            this.$message.success('请重新登录 ヾ(￣▽￣)Bye~Bye~')
          }
        } else {
          this.$message.error('绑定失败 o(╥﹏╥)o')
        }
      })
    },
    handleEdit(row) {
      this.form = row
      this.isDisable = false
      this.dialogFormVisible = true
      this.load()
      this.isDisable = true
    }
    ,
    isDel(id) {
      this.delId = id
      this.delDialogVisible = true
    }
    ,
    doDel() {
      this.request.delete("role/" + this.delId).then(res => {
        if (res.code === '200') {
          this.$message.success("删除成功")
          this.load()
        } else {
          this.$message.error("删除失败")
        }
        this.delDialogVisible = false
      })
    }
    ,
    doExport() {
      window.open("http://" + serverIp + ":9090/role/export")
      this.exportDialogVisible = false
    }
    ,
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
    ,
    doDelAll() {
      let ids = this.multipleSelection.map(v => v.id)
      this.request.post("role/del/batch", ids).then(res => {
        if (res.code === '200') {
          this.$message.success("批量删除成功")
          this.load()
        } else {
          this.$message.error("批量删除失败")
        }
        this.delAllDialogVisible = false
      })
    }
    ,
    reset() {
      this.name = ""
      this.description = ""
      this.load()
    }
    ,
    handleAdd() {
      this.dialogFormVisible = true
      this.form = {}
    }
    ,
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.load()
    }
    ,
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.load()
    }
    ,
    tableColor({row, rowIndex}) {
      if (rowIndex % 2 === 0) {
        return {backgroundColor: '#f0f9ff'}
      } else {
        return {backgroundColor: '#e0f2fe'}
      }
    }
    ,
    selectMenu(roleId) {
      this.roleId = roleId
      //  请求菜单数据
      this.request.get("/menu").then(res => {
        this.menuData = res.data
        //  后台数据处理成id数组
        this.expends = this.menuData.map(v => v.id)
      })
      //  请求角色数据
      this.request.get("role/roleMenu/" + roleId).then(res => {
        //  先清空 checks
        this.checks = []
        //  不将父级id传入checks
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].path !== '/') {
            this.checks.push(res.data[i].id)
          }
        }
        this.menuDialogVisible = true
      })
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
