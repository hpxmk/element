<template>
  <div style="margin: 20px;">
    <el-date-picker
      v-model="value1"
      :asyUpdateDate="asyUpdateDates"
      type="date"
      @preMonthDate="changeTime"
      placeholder="选择日期"
    >
    </el-date-picker>
    <el-input v-model="input" placeholder="请输入内容"></el-input>
    <el-date-week
      :dateData="dates"
      @handleClick="handleClick"
      v-model="time"
    ></el-date-week>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value1: '',
      asyUpdateDates: false,
      input: 'Hello Element UI 黄培霞!',
      defaultData: {
        yearMonth: ''
      },
      pickerOptions: {
        cellClassName: time => {
          debugger;
          return 'h';
        }
      },
      time: '',
      dates: {
        dateValue: 'Sat Jun 03 2019 00:00:00 GMT+0800',
        endTime: new Date()
      }
    };
  },
  created() {
    this.dates.dateValue = 'Sat Jun 01 2028 00:00:00 GMT+0800';
  },
  methods: {
    changeTime(time) {
      // debugger
      // this.asyUpdateDates = true;
       console.log(this. otherFormatDate(time,"yyyy-MM-dd"));
      let _myDate = new Date(time.getFullYear(), time.getMonth(), 1);
      let date = _myDate.getDate(); //获取当前日(1-31)
      let day = _myDate.getDay(); //获取当前星期X(0-6,0代表星期天)
      console.log(time.getMonth() - 1);
     
     
    },
    otherFormatDate(date, fmt) {
  // if (isEmpty(date)) return;
      //日期格式化
      //author: meizz
      var o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        );
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ('00' + o[k]).substr(('' + o[k]).length)
          );
        }
      }
      return fmt;
    },
    getd(date, day) {
      result = day - ((date % 7) - 1);
      re = result < 0 ? 7 + result : result;
      return re;
    },
    getMonth(value) {
      let nstr = new Date(value); //当前Date日期
      let ynow = nstr.getFullYear(); //年份
      let mnow = nstr.getMonth(); //月份
      console.log(nstr);
      this.dates.dateValue = nstr;
      this.time = nstr;
    },
    daterows() {
      console.log('de', e);
    },
    handleClick(e) {
      console.log('de', e);
    }
  }
};
</script>
