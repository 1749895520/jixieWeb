<template>
  <div>
    <el-card class="box-card box-opacity">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="轮播图片" name="1">
          <el-upload
              style="display: flex;justify-content: center"
              class="box-carousel"
              :class="{'CarouselFull':this.carouselList.length===5}"
              :action="'http://'+serverIp+':9090/official/upload/carousel'"
              list-type="picture-card"
              :limit="5"
              accept=".png,.jpg"
              :file-list="this.carouselList"
              :on-preview="handlePictureCardPreview"
              :on-success="handelUpload"
              :before-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog
              title="轮播图预览"
              class="box-card"
              :modal-append-to-body="false"
              :visible.sync="dialogVisible">
            <div style="height: auto;width: auto;text-align: center">
              <img style="position: relative;width: 100%" :src="dialogImageUrl" alt="">
            </div>
          </el-dialog>
        </el-collapse-item>
        <el-collapse-item title="通知公告" name="2">
          <notice/>
        </el-collapse-item>
        <el-collapse-item title="协会动态" name="3">
          <News/>
        </el-collapse-item>
        <el-collapse-item title="友情链接" name="4">
          <Link/>
        </el-collapse-item>
      </el-collapse>
    </el-card>
    <!--        删除轮播图信息-->
    <el-dialog
        :modal-append-to-body="false"
        title="提示"
        :visible.sync="delCarouselDialogVisible"
        :width="this.$store.state.windowOrPhone?'30%':'80%'">
      <span>确认删除当前轮播图？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="delCarouselDialogVisible = false">我再想想</el-button>
    <el-button type="primary" @click="delCarousel">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {serverIp} from "../../public/config";
import Notice from "@/views/Notice";
import News from "@/views/News";
import Link from "@/views/Link";

export default {
  name: "index",
  components: {Link, News, Notice},
  data() {
    return {
      serverIp: serverIp,
      activeName: '1',
      labelPosition: 'left',
      carouselList: [],
      form: {},
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      dialogImageUrl: '',
      delCarouselId: 0,
      exceed: false,
      dialogVisible: false,
      delDialogVisible: false,
      delCarouselDialogVisible: false,
    }
  },
  created() {
    this.load()
    this.loadCarousel()
  },
  methods: {
    handelUpload() {
      this.loadCarousel()
    },
    handleRemove(file) {
      this.delCarouselId = file.id
      this.delCarouselDialogVisible = true
      return false
    },
    delCarousel() {
      this.request.delete('/official/' + this.delCarouselId).then(res => {
        if (res.data) {
          this.$message.success("删除成功")
          this.load()
        } else {
          this.$message.error("删除失败")
        }
        this.delCarouselDialogVisible = false
        this.loadCarousel()
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    async getUser() {
      return (await this.request.get('user/username/' + this.user.username)).data
    },
    load() {
      this.request.get('user/username/' + this.user.username).then(res => {
        if (res.code === '200') {
          this.form = res.data;
        }
      })
    },
    loadCarousel() {
      this.carouselList = []
      this.request.get('/official/carousel').then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.carouselList.push({url: res.data[i].content, id: res.data[i].id})
        }
      })
    },
    save() {
      this.request.post("user/", this.form).then(res => {
        if (res.data) {
          this.$message.success("保存成功")
          //  更新浏览器的缓存信息
          this.getUser().then(res => {
            res.token = JSON.parse(localStorage.getItem('user')).token
            this.$store.state.user = res
            localStorage.setItem('user', JSON.stringify(res))
          })
          //  返回个人信息
          this.activeName = '1'
        } else {
          this.$message.error("保存失败")
        }
      })
    },
    cancel() {
      this.load()
    },
    handleAvatarSuccess(res) {
      this.form.avatarUrl = res;
    }
  }
}
</script>

<style scoped>
.box-carousel >>> .el-upload-list__item.is-success {
  width: 193px;
  height: 108px;
}

.box-carousel >>> .el-upload-list__item-thumbnail {
  width: 100%;
  height: 100%;
}

.box-carousel >>> .el-upload-list__item {
  transition: none;
}

.box-carousel >>> .el-upload--picture-card {
  width: 230px;
  height: 135px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.input-inner >>> .el-input__inner {
  width: 70%;
}

.CarouselFull >>> .el-upload--picture-card {
  display: none;
}
</style>
