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
          <el-input maxlength="50" style="width: 80%" v-model="form.name" autocomplete="off"></el-input>
          <el-button style="margin-left: 10px" @click="reset">重 置</el-button>
          <el-button style="margin-left: 10px" type="primary" @click="save">发 布</el-button>
        </el-form-item>
        <el-form-item label="内容">
          <mavon-editor style="position:relative;z-index: 2;min-height: 60vh;max-height: 60vh" class="box-opacity"
                        ref="md"
                        v-model="form.content"
                        :ishljs="true"
                        @imgAdd="imgAdd"/>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
import {serverIp} from "../../public/config";

export default {
  name: "PublishBlog",
  data() {
    return {
      form: {
        content: '',
        name: '',
      },
      dialogFormVisible: false,
      serverIp: serverIp,
    }
  },
  created() {
    this.$store.state.isCollapse = true
  },
  methods: {
    save() {
      console.log(this.form)
      if (this.form.name === null || this.form.name === '') {
        this.$message.error('文章标题不能为空！')
      } else if (this.form.content === '') {
        this.$message.error('文章内容不能为空！')
      } else {
        this.request.post("article/", this.form).then(res => {
          if (res.data) {
            this.$message.success("发布成功")
          } else {
            this.$message.error("发布失败")
          }
          this.reset()
          this.$router.push('/center/blog/person')
        })
      }
    },
    reset() {
      this.form = {}
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
