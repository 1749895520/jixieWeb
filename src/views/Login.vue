<template>
  <div>
    <vue-particles
        class="login-bg wrapper"
        color="#f0f0f0"
        :particleOpacity="0.7"
        :particlesNumber="80"
        shapeType=""
        :particleSize="4"
        linesColor="#f0f0f0"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="3"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
        style="position: absolute"
    />
    <div style="display: inline-flex;position:relative; margin-left: 30%;margin-top: 10%"
         class="box-fadeIn">
      <el-card class="form-box box-card" :style="form_box">
        <el-form :rules="registerRules" :ref="registerUser" :model="registerUser">
          <div class="register-box hidden" v-show="!this.loginOrRegister">
            <h1>register</h1>
            <el-form-item prop="username">
              <el-input v-model="registerUser.username" class="login-input"
                        placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="registerUser.password" class="login-input" show-password
                        placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item prop="surePassword">
              <el-input v-model="registerUser.surePassword" class="login-input" show-password
                        placeholder="确认密码"></el-input>
            </el-form-item>
            <el-button @click="register(registerUser)">注册</el-button>
          </div>
        </el-form>
        <el-form :rules="loginRules" :ref="loginUser" :model="loginUser">
          <div class="login-box" v-show="this.loginOrRegister">
            <h1>login</h1>
            <el-form-item prop="username">
              <el-input v-model="loginUser.username" class="login-input" type="userName" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginUser.password" class="login-input" show-password type="password"
                        placeholder="密码"></el-input>
            </el-form-item>
            <el-button @click="login(loginUser)">登录</el-button>
          </div>
        </el-form>
      </el-card>
      <el-card class="container box-card">
        <div class="con-box left">
          <div>
            <h2>欢迎来到</h2>
            <h2><span>AHPU</span></h2>
            <h2><span>计算机协会官网</span></h2>
          </div>
          <div style="margin-top: 100px">
            <p>已有账号</p>
            <el-button @click="lor">去登陆</el-button>
          </div>
        </div>
        <div class="con-box right">
          <div>
            <h2>欢迎来到</h2>
            <h2><span>AHPU</span></h2>
            <h2><span>计算机协会官网</span></h2>
          </div>
          <div style="margin-top: 100px">
            <p>没有账号？</p>
            <el-button @click="lor">去注册</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {setRoutes} from "@/router";

export default {
  name: "Login",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.registerUser.surePassword !== '') {
          this.$refs.registerUser.validateField('surePassword');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.registerUser.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      form_box: {
        transform: 'translateX(0%)',
      },
      loginOrRegister: true,
      registerUser: {
        username: '',
        nickname: '',
        avatarUrl: '',
        password: '',
        role: 'ROLE_USER',
        surePassword: '',
      },
      loginUser: {
        username: '',
        password: ''
      },
      registerRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
        ],
        password: [
          {validator: validatePass, trigger: 'blur'}
        ],
        surePassword: [
          {validator: validatePass2, trigger: 'blur'}
        ]
      },
      loginRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    lor() {
      this.loginOrRegister = !this.loginOrRegister
      this.$data.form_box.transform = this.$data.form_box.transform === 'translateX(80%)' ? 'translateX(0%)' :
          'translateX(80%)'
    },
    login(loginUser) {
      this.$refs[loginUser].validate((valid) => {
        if (valid) {
          this.request.post('user/login', this.loginUser).then(res => {
            if (res.code === '200') {
              localStorage.setItem('user', JSON.stringify(res.data))   //  存储用户信息到浏览器
              console.log(res.data)
              localStorage.setItem('menus', JSON.stringify(res.data.menus))  //  储存当前角色的菜单
              this.$message.success('登陆成功 ヾ(✿ﾟ▽ﾟ)ノ')
              this.$router.push(this.$store.state.homePath)
              if (this.$route.path === '/login') {
                window.history.back();     //返回上一页并强行刷新
              }
              //  动态设置当前用户的路由
              setRoutes()
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    register(registerUser) {
      this.registerUser.nickname = this.registerUser.username
      this.$refs[registerUser].validate((valid) => {
        if (!valid) {
          if (this.registerUser.password !== this.registerUser.surePassword) {
            return false
          }
          this.request.post('user/register', this.registerUser).then(res => {
            if (res.code === '200') {
              this.$message.success('注册成功 (＾－＾)V')
              this.loginUser.username = this.registerUser.username
              this.lor()
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
  }
}
</script>

<style scoped>

.wrapper {
  height: 100vh;
  background-image: linear-gradient(to top right, #7F7FD5, #86A8E7, #91EAE4);
  background-size: cover;
  width: 100%;
  overflow: hidden;
}

body {
  /* 100%窗口高度 */
  min-height: 100vh;
  /* 弹性布局 水平+垂直布局 */
  display: flex;
  justify-content: center;
  align-items: center;
  /* 渐变背景(背景从左下到右上的渐变色) */
  background: linear-gradient(200deg, #f3e7e9, #e3eeff);
}

.container {
  background-color: #e3fdfd;
  width: 650px;
  height: 415px;
  /* 阴影 */
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
  /* 相对定位 */
  position: relative;
}

.form-box {
  /* 绝对定位 */
  position: absolute;
  top: -10%;
  left: 5%;
  background-color: #a6e3e9;

  width: 320px;
  height: 500px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  /* 动画过渡 加速后减速 */
  transition: 0.5s ease-in-out;
}

.register-box, .login-box {
  /* 弹性布局 垂直排列 */
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

h1 {
  text-align: center;
  margin-bottom: 25px;
  /* 大写 */
  text-transform: uppercase;
  color: #fff;
  /* 字间距 */
  letter-spacing: 5px;
}

.login-input >>> .el-input__inner {
  background-color: transparent;
  width: 100%;
  color: #fff;
  border: none;
  /* 下边框样式 */
  border-bottom: 2px solid rgba(255, 255, 255, 0.4);
  padding: 10px 0;
  text-indent: 10px;
  margin: 8px 0;
  font-size: 14px;
  letter-spacing: 2px;
}

.login-input >>> .el-input__inner::placeholder {
  color: #fff;
}

.login-input >>> .el-input__inner:focus {
  color: #71c9ce;
  outline: none;
  border-bottom: 2px solid #71c9ce;
  transition: 0.5s;
}

.login-input >>> .el-input__inner:focus::placeholder {
  opacity: 0;
}

.form-box button {
  width: 70%;
  margin-top: 35px;
  background-color: #f6f6f6;
  outline: none;
  font-size: 15px;
  border-radius: 8px;
  padding: 13px;
  color: #71c9ce;
  letter-spacing: 2px;
  border: none;
  cursor: pointer;
}

.form-box button:hover {
  background-color: #71c9ce;
  color: #f6f6f6;
  transition: background-color 0.5s ease;
}

.con-box {
  width: 50%;
  /* 弹性布局 垂直排列 居中 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* 绝对定位 居中 */
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.con-box.left {
  left: -2%;
}

.con-box.right {
  right: -2%;
}

.con-box h2 {
  color: #8e9aaf;
  font-size: 25px;
  font-weight: bold;
  letter-spacing: 3px;
  text-align: center;
  margin-bottom: 4px;
}

.con-box p {
  font-size: 12px;
  letter-spacing: 2px;
  color: #8e9aaf;
  text-align: center;
}

.con-box span {
  color: #a6e3e9;
}

.con-box img {
  width: 150px;
  height: 150px;
  opacity: 0.9;
  margin: 40px 0;
}

.con-box button {
  margin-top: 3%;
  background-color: #fff;
  color: #8e9aaf;
  border: 1px solid #f0f0f0;
  padding: 6px 10px;
  border-radius: 5px;
  letter-spacing: 1px;
  outline: none;
  cursor: pointer;
}

.con-box button:hover {
  background-color: #a6e3e9;
  color: #fff;
}
</style>
