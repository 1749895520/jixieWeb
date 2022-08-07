<template>
  <div>
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
      <el-table-column prop="id" label="ID" width="80px">
      </el-table-column>
      <el-table-column prop="name" label="文件名称" min-width="100px">
      </el-table-column>
      <el-table-column prop="type" label="文件类型" min-width="100px">
      </el-table-column>
      <el-table-column prop="size" label="文件大小(kb)" min-width="100px">
      </el-table-column>
      <el-table-column label="下载" min-width="50px">
      </el-table-column>
      <el-table-column prop="enable" label="启用" min-width="100px">
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
  </div>
</template>

<script>
import {serverIp} from "../../public/config";

export default {
  name: "Files.vue",
  data() {
    return {
      tableData: [],
      serverIp: serverIp
    }
  },
  created() {
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
      this.dialogFormVisible = true
      this.load()
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
        return {backgroundColor: '#f0f9ff'}
      } else {
        return {backgroundColor: '#e0f2fe'}
      }
    }
  }
}
</script>

<style scoped>

</style>
