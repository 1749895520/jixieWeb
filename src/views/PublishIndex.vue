<template>
  <div>
    <el-card class="box-card box-opacity">
      <el-form
          :inline="false"
          class="demo-form-inline"
          label-width="60px"
          style="height: 100%"
      >
        <el-form-item label="标题">
          <el-input maxlength="50" style="width: 60%" v-model="form.name" autocomplete="off"></el-input>
          <el-button style="margin-left: 10px" @click="reset">重 置</el-button>
          <el-button style="margin-left: 10px" type="primary" @click="save">发 布</el-button>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="fileType" class="box-select" placeholder="请选择" :value="fileType">
            <el-option
                v-for="item in types"
                :key="item.type"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
          <mavon-editor style="min-height: 60vh;max-height: 100vh" class="box-opacity"
                        ref="md"
                        v-model="form.content"
                        :ishljs="true"
                        @imgAdd="imgAdd"/>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog
        title="提示"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        width="30%">
      <span>是否关闭当前页面？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="sure">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import {serverIp} from "../../public/config";

export default {
  name: "PublishIndex",
  data() {
    return {
      fileType: '1',
      fileId: '',
      dialogVisible: false,
      form: {
        content: '',
        name: '',
      },
      types: [
        {
          type: 1,
          label: '通知公告',
          value: '1'
        },
        {
          type: 2,
          label: '协会动态',
          value: '2'
        },
        {
          type: 4,
          label: '协会资料',
          value: '4'
        }
      ],
      dialogFormVisible: false,
      serverIp: serverIp,
    }
  },
  created() {
    this.$store.state.isCollapse = true
    if (this.$route.query.type) {
      this.fileType = this.$route.query.type
    }
    if (this.$route.query.id) {
      this.fileId = this.$route.query.id
      this.get(this.fileId)
    }
  },
  methods: {
    get(id) {
      this.request.get('/official/' + id).then(res => {
        this.form = res.data
      })
    },
    save() {
      console.log(this.form)
      if (this.form.name === null || this.form.name === '') {
        this.$message.error('文章标题不能为空！')
      } else if (this.form.content === '') {
        this.$message.error('文章内容不能为空！')
      } else {
        this.request.post("official/" + this.fileType, this.form).then(res => {
          if (res.data) {
            this.$message.success("发布成功")
          } else {
            this.$message.error("发布失败")
          }
          this.reset()
          this.dialogVisible = true
        })
      }
    },
    reset() {
      this.form = {
        content: '',
        name: '',
      }
    },
    //  绑定imgAdd event
    imgAdd(pos, $file) {
      let $vm = this.$refs.md
      //  第一步，将图片上传到服务器
      const formData = new FormData()
      formData.append('file', $file)
      axios({
        url: 'http://' + serverIp + ':9090/file/upload/data/' + this.fileType,
        method: 'post',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'},
      }).then((res) => {
        //  第二步，将返回的url替换到文本原位置 ![...](./0) -> ![...](url)
        $vm.$img2Url(pos, res.data)
      })
    },
    cancel() {
      this.dialogVisible = false
      this.$router.push('/center/system/index')
    },
    sure() {
      this.dialogVisible = false
      window.close()
    }
  }
}
</script>

<style scoped>
.box-select {
  width: 100px;
}
</style>
