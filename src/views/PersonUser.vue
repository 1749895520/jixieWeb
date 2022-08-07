<template>
  <div>
    <el-card class="box-card box-opacity">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="个人信息" name="1">
          <el-card style="background-color: #c7e5f9" class="box-card">
            <el-row :gutter="12">
              <el-col :span="16" :xs="24">
                <el-card style="background-color: #f0f9ff">
                  <el-descriptions class="margin-top" :column="1" size="big" border>
                    <el-descriptions-item>
                      <template slot="label">
                        <i class="el-icon-user"></i>
                        用户名
                      </template>
                      {{ form.username }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template slot="label">
                        <i class="el-icon-s-opportunity"></i>
                        昵称
                      </template>
                      {{ form.nickname }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template slot="label">
                        <i class="el-icon-notebook-2"></i>
                        专业
                      </template>
                      {{ form.speciality }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template slot="label">
                        <i class="el-icon-school"></i>
                        班级
                      </template>
                      {{ form.gradeClass }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template slot="label">
                        <i class="el-icon-house"></i>
                        故乡
                      </template>
                      {{ form.address }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template slot="label">
                        <i class="el-icon-user-solid"></i>
                        用户类型
                      </template>
                      <el-tag size="small">管理员</el-tag>
                    </el-descriptions-item>
                  </el-descriptions>
                </el-card>
              </el-col>
              <el-col :span="8" :xs="24" style="display: flex;justify-content: center">
                <el-card style="height: 100%;background-color: #f0f9ff;margin-top: 20px">
                  <img v-if="form.avatarUrl!==''" :src="form.avatarUrl"
                       class="avatar" style="width: 200px;height: 200px;border-radius: 10px"
                       alt="">
                  <img
                      v-if="form.avatarUrl===''"
                      :src="'http://'+serverIp+':9090/file/avatar/avatar.png'"
                      class="avatar"
                      style="width: 200px;height: 200px;border-radius: 10px"
                      alt="">
                </el-card>
              </el-col>
            </el-row>
          </el-card>
        </el-collapse-item>
        <el-collapse-item title="个人信息修改" name="2">
          <div>
            <el-row :gutter="10">
              <el-col :span="8" :xs="24" style="display: flex;justify-content: center">
                <el-card style="height: 100%;background-color: #f0f9ff;border-radius: 20px">
                  <el-upload
                      class="avatar-uploader"
                      :action="'http://'+serverIp+':9090/file/upload/avatar'"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess">
                    <img v-if="form.avatarUrl" :src="form.avatarUrl"
                         class="avatar" style="width: 200px;height: 200px;border-radius: 10px" alt="">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-card>
              </el-col>
              <el-col :span="16" :xs="24">
                <el-form
                    :inline="false"
                    :label-position="labelPosition"
                    label-width="80px"
                    class="demo-form-inline"
                    style="margin: 20px 5px 5px;">
                  <el-form-item label="用户名">
                    <el-input :disabled="true" style="width: 80%" v-model="form.username"
                              autocomplete="off"></el-input>
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
              </el-col>
            </el-row>
            <el-row :gutter="10" style="margin-top: 5px">
              <el-col :span="12" :xs="12" style="display: inline-flex;justify-content: right">
                <el-button class=" animate__pulse" style="background-color: #c7e5f9;color: #fff"
                           @click="cancel">取 消
                </el-button>
              </el-col>
              <el-col :span="12" :xs="12" style="display: inline-flex;justify-content: left">
                <el-button class=" animate__pulse" style="background-color: #c7e5f9;color: #fff"
                           @click="save">确 定
                </el-button>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        <el-collapse-item title="密码修改" name="3">
          <div>

          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
import {serverIp} from "../../public/config";

export default {
  name: "Person",
  data() {
    return {
      serverIp: serverIp,
      activeName: '1',
      labelPosition: 'left',
      form: {},
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
    }
  },
  created() {
    this.load()
  },
  methods: {
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
        // location.reload()
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

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.input-inner >>> .el-input__inner {
  width: 70%;
}
</style>
