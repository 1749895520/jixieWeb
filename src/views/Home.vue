<template>
  <div>
    <el-row :gutter="20" class="box-statistics">
      <el-col :lg="12" :xs="24" class="box-centerHome-topCol">
        <el-card class="box-opacity box-card" style="color: #409EFF">
          <div><i class="el-icon-user-solid" style="margin-right: 5px"/>已注册用户数量</div>
          <div class="box-centerHome-top">
            <div class="box-centerHome-number">
              <animate-number from="0" :to="1000" duration="1000"></animate-number>
            </div>
            <img class="box-centerHome-image"
                 src="../../public/images/centerHome-1.jpg"
                 alt=""/>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="12" :xs="24" class="box-centerHome-topCol">
        <el-card class="box-opacity box-card" style="color: #E6A23C">
          <div><i class="el-icon-edit-outline" style="margin-right: 5px"/>已发布博客数量</div>
          <div class="box-centerHome-top">
            <div class="box-centerHome-number">
              <animate-number from="0" :to="1000" duration="1500"></animate-number>
            </div>
            <img class="box-centerHome-image"
                 src="../../public/images/centerHome-2.jpg"
                 alt=""/>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="12" :xs="24" class="box-centerHome-topCol">
        <el-card class="box-opacity box-card" style="color: #F56C6C">
          <div><i class="el-icon-basketball" style="margin-right: 5px"/>已开展活动数量</div>
          <div class="box-centerHome-top">
            <div class="box-centerHome-number">
              <animate-number from="0" :to="1000" duration="500"></animate-number>
            </div>
            <img class="box-centerHome-image"
                 src="../../public/images/centerHome-3.jpg"
                 alt=""/>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="12" :xs="24" class="box-centerHome-topCol">
        <el-card class="box-opacity box-card" style="color: #67C23A">
          <div><i class="el-icon-trophy" style="margin-right: 5px"/>OJ提交总次数</div>
          <div class="box-centerHome-top">
            <div class="box-centerHome-number">
              <animate-number from="0" :to="1000" duration="2000"></animate-number>
            </div>
            <img class="box-centerHome-image"
                 src="../../public/images/centerHome-4.jpg"
                 alt=""/>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :lg="10" :xs="24" class="box-centerHome-topCol">
        <el-card class="box-card box-opacity box-card-show">
          <div class="box-echarts-title">
            <p class="echarts-title">OJ排行榜</p>
          </div>
          <el-table :data="tableData"
                    highlight-current-row
                    stripe
                    style="width: 100%;"
                    @selection-change="handleSelectionChange"
                    fit
                    max-height="250"
                    :cell-style="tableColor"
                    v-loading="isLoading"
          >
            <el-table-column prop="avatarUrl" label="头像" min-width="30px">
              <template slot-scope="scope">
                <img :src="scope.row.avatarUrl"
                     style="width:20px; height:19px;border-radius: 50%;display: inline-flex" alt=""></img>
              </template>
            </el-table-column>
            <el-table-column prop="nickname" label="昵称" min-width="80px">
            </el-table-column>
            <el-table-column prop="speciality" label="专业" min-width="50px">
            </el-table-column>
            <el-table-column prop="gradeClass" label="班级" min-width="50px">
            </el-table-column>
            <el-table-column prop="passNum" label="OJ刷题量" min-width="50px">
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :lg="8" :xs="24" class="box-centerHome-topCol">
        <el-card class="box-card box-opacity box-card-show">
          <div class="box-echarts-title">
            <p class="echarts-title">用户专业分布</p>
          </div>
          <div style="display: flex; justify-content: center;width: 100%;height: 250px"
               id="PI"
               class="box-echarts-body"/>
        </el-card>
      </el-col>
      <el-col :lg="6" :xs="24" class="box-centerHome-topCol">
        <el-card class="box-card box-opacity box-card-show">
          <div style="height: 310px">
            <el-calendar class="box-calendar" v-model="value">
            </el-calendar>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: "Home",
  data() {
    return {
      tableData: [],
      result: [],
      isLoading: true,
      total: 0,
      pageNum: 1,
      pageSize: 5,
      nickname: "",
      speciality: "",
      gradeClass: "",
      avatarUrl: "",
      passNum: "",
      value: new Date()
    }
  },
  created() {
    this.load()
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  },
  methods: {
    tableColor({row, rowIndex}) {
      if (rowIndex % 2 === 0) {
        return {backgroundColor: '#f0f9ff'}
      } else {
        return {backgroundColor: '#e0f2fe'}
      }
    },
    load() {
      this.request.get("user/OJ", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          nickname: this.nickname,
          speciality: this.speciality,
          gradeClass: this.gradeClass,
          avatarUrl: this.avatarUrl,
          passNum: this.passNum
        }
      }).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
  },
  mounted() { //  页面元素渲染后才触发
    /**
     * 折线图 & 树状图
     * @type {HTMLElement}
     */
    /*    let chartDom = document.getElementById('main');
        let myChart = echarts.init(chartDom);

        let option = {
          title: {
            text: '各季度用户注册数量图',
            subtext: '趋势图',
            left: 'center'
          },
          xAxis: {
            type: 'category',
            data: ["第一季度", "第二季度", "第三季度", "第四季度"]
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [],
              type: 'line'
            },
            {
              data: [],
              type: 'bar'
            }
          ]
        };
        option && myChart.setOption(option);

        /!**
         * 请求数据
         *!/
        this.request.get("/echarts/members").then(res => {
          // option.xAxis.data = res.data.x
          option.series[0].data = res.data
          option.series[1].data = res.data
          myChart.setOption(option)
        })*/

    /**
     * 饼图
     * @type {HTMLElement}
     */
    let PIDom = document.getElementById('PI');
    let PIChart = echarts.init(PIDom);
    let PIoption = {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"//模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '人数',
          type: 'pie',
          radius: '70%',
          //标签
          label: {
            show: true,
            position: 'inside',
            formatter: '{d}%',//模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
          },
          data: this.result,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    PIoption && PIChart.setOption(PIoption);
    /**
     * 请求数据
     */
    this.request.get("/echarts/speciality").then(res => {
      for (let i = 0; i < res.data.length; i++) {
        let d = {name: '', value: 0}
        d.name = res.data[i].name
        d.value = res.data[i].value
        this.result.push(d)
      }
      PIChart.setOption(PIoption)
    })
  }
}
</script>

<style scoped>
.box-statistics {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  position: relative;
  box-sizing: border-box;
}

.box-card-show >>> .el-card__body {
  padding: 0;
}

.box-calendar /deep/ .el-calendar-table .el-calendar-day {
  width: 100%;
  height: 25px;
  font-size: 10px;
  background-color: #c7e5f9;
  border-radius: 5px;
}

.box-calendar /deep/ .el-calendar-day:hover {
  background-color: #f0f9ff;
}

.box-calendar /deep/ .el-calendar-table:focus {
  background-color: #f0f9ff;
}

.box-calendar /deep/ .el-calendar__header {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  background-color: #e0f2fe;
  padding: 0;
}

.box-calendar /deep/ .el-calendar__body {
  background-color: #e0f2fe;
  padding: 0 5px;
}

.box-calendar /deep/ .el-calendar__title {
  font-weight: bold;
  padding-left: 20px;
  color: #6b7280;
  font-size: 18px;
  padding-top: 20px;
  display: inline;
  text-align: left;
  width: 100%;
  height: 60px;
  border-bottom: 1px solid #fff;
}

.box-calendar /deep/ .el-button-group {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding-top: 10px;
}

.box-calendar /deep/ .el-button {
  background-color: #c7e5f9;
  color: #fff;
  border-color: #fff;
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.box-calendar /deep/ .el-button:hover {
  border-color: #ecf5ff;
  color: #409eff;
}

</style>
