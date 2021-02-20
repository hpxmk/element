<template>
  <div ref="box" class="el-dateweek">
    <div
      class="el-dateweek__date"
      :title="dates.dateValue"
      @mouseover="overStyle"
      @mouseout="outStyle"
      @click="open()"
    >
      <i class="el-input__icon el-icon-date default-date"></i>
      <span v-if="dates.dateValue !== ''">{{ dates.dateValue }}</span>
      <span v-else class="default-date">请点击选择日期</span>
      <i
        v-if="dates.showEmpty"
        class="el-icon-circle-close"
        @click.stop="close"
      ></i>
    </div>
    <div class="el-dateweek__calender" v-if="dates.show">
      <div class="el-dateweek__calender--table">
        <table cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <th v-for="(item, index) in dates.week" :key="index">
                {{ item }}
              </th>
            </tr>
            <template v-for="(item, indexParent) in dates.monthList">
              <tr :key="indexParent + 'm'">
                <template v-for="(itemChild, index) in item.day">
                  <td :key="index + 'n'">
                    <div v-if="itemChild.date === ''">
                      <span :class="itemChild.active ? 'active' : ''">
                        {{ itemChild.date }}
                      </span>
                    </div>
                    <template v-else>
                      <div
                        :class="itemChild.disabled ? 'disabled' : ''"
                        @click="
                          getDateClick(
                            indexParent,
                            index,
                            itemChild.disabled,
                            item
                          )
                        "
                      >
                        <span :class="itemChild.active ? 'active' : ''">
                          {{ itemChild.date }}
                        </span>
                      </div>
                    </template>
                  </td>
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ElDateWeek',
  model: {
    prop: 'value',
    event: 'handleClick'
  },
  props: {
    value: '',
    dateData: {
      type: Object,
      default: () => {
        return {
          dateValue: new Date(), // 日期值Sat Jun 01 2019 00:00:00 GMT+0800 (中国标准时间)
          maxDate: '', // Sat Jun 01 2019 00:00:00 GMT+0800 (中国标准时间)
          minDate: '', // Sat Jun 01 2019 00:00:00 GMT+0800 (中国标准时间)
          format: '' // 格式化日期
        };
      }
    }
  },
  data() {
    return {
      date: {
        clearData: true
      },
      dates: {
        week: ['日', '一', '二', '三', '四', '五', '六'], // 星期值
        monthList: [], // 日期
        weekDay: '', // 上个月剩余天数
        lastMonthDay: 0, // 下个月剩余天数
        dateValue: '', // 渲染选中的日期值
        show: false, // 是否打开日历
        showEmpty: false // 是否展示清空按钮
      }
    };
  },
  created() {
    this.date = Object.assign(this.date, this.dateData);
    console.log(this.date.dateValue);
    if (this.isEmpty(this.date.dateValue)) return;
    let _date = new Date(this.date.dateValue);
    this.dates.dateValue = this.formatDate(_date, 'yyyy-MM-dd');
  },
  watch: {
    /*eslint no-debugger: "error"*/
    'dateData.dateValue': {
      handler(newValue, oldValue) {
        console.log('d', newValue);
        if (newValue !== '') {
          this.resetData();
          if (this.isEmpty(this.value)) return;
          let _date = new Date(this.value);
          this.dates.dateValue = this.formatDate(_date, 'yyyy-MM-dd');
        }
      }
    }
  },
  mounted() {
    document.body.addEventListener('click', e => {
      // 点击除了当前组件外，组件关闭，不包括当前组件
      if (!this.$el.contains(e.target)) {
        this.dates.show = false;
      }
    });
  },
  methods: {
    resetData() {
      this.dates.dateValue = '';
      this.dateData.maxDate = '';
      this.dateData.minDate = '';
      this.dates.monthList.forEach(element => {
        // 渲染选中的日期
        if (element.day.length !== 0) {
          element.day.forEach(elementChild => {
            elementChild.disabled = false;
          });
        }
      });
    },
    initMaxAndMinDate() {
      if (this.dateData.dateValue === '') return;
      let _maxDate = this.dateData.maxDate
        ? this.formatDate(this.dateData.maxDate, 'dd')
        : ''; // 获取日期
      let _minDate = this.dateData.minDate
        ? this.formatDate(this.dateData.minDate, 'dd')
        : ''; // 获取日期
      this.dates.monthList.forEach(element => {
        // 渲染选中的日期
        if (element.day.length !== 0) {
          element.day.forEach(elementChild => {
            if (
              (_maxDate && elementChild.date > _maxDate) ||
              (_minDate && elementChild.date < _minDate)
            ) {
              elementChild.disabled = true;
            }
          });
        }
      });
    },
    init() {
      // 初始化数据
      if (this.dates.dateValue === '') return;
      let _date = new Date(this.dates.dateValue.replace(/-/g, '/')); // 正则替换标准的格式化
      let _day = this.formatDate(_date, 'dd'); // 获取日期Wed Jun 05 2019 00:00:00 GMT+0800 (中国标准时间)
      let day = _day < 10 ? _day.substr(1) : _day;

      this.dates.monthList.forEach(element => {
        // 渲染选中的日期
        if (element.day.length !== 0) {
          element.day.forEach(elementChild => {
            if (elementChild.date === parseInt(day, 10)) {
              elementChild.active = true;
            }
          });
        }
      });
    },
    open() {
      // 打开日历
      this.dates.show = true; // 打开日历
      this.getDate(this.dateData.dateValue); // 渲染日历
      this.init(); // 初始化数据
      this.initMaxAndMinDate();
    },
    overStyle() {
      if (!this.date.clearData) return;
      if (this.dates.dateValue === '') return;
      this.dates.showEmpty = true;
    },
    outStyle() {
      if (!this.date.clearData) return;
      if (this.dates.dateValue === '') return;
      this.dates.showEmpty = false;
    },
    close() {
      this.dates.dateValue = '';
      this.initMaxAndMinDate();
      this.dates.show = false;
      this.dates.showEmpty = false;
      this.$emit('handleClick', this.dates.dateValue);
    },
    getDate(_year) {
      // 日历渲染
      // Sat Jun 01 2019 00:00:00 GMT+0800 (中国标准时间)
      this.dates.monthList = [];
      var nstr = new Date(_year); // 当前Date日期
      var ynow = nstr.getFullYear(); // 年份
      var mnow = nstr.getMonth(); // 月份
      var dnow = nstr.getDate(); // 今日日期
      var n1str = new Date(ynow, mnow, 1); // 当月第一天Date日期
      var firstDay = n1str.getDay(); // 当月第一天星期几
      var m_days = [
        31,
        28 + this.is_leap(ynow),
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
      ]; // 各月份的总天数

      this.dates.weekDay = firstDay === 7 ? 0 : firstDay;
      let monthLen = m_days[mnow];
      this.dates.lastMonthDay = 42 - m_days[mnow] - this.dates.weekDay;
      for (let i = 1; i <= monthLen; i++) {
        this.dates.monthList.push(i);
      }
      for (let i = 0; i < this.dates.weekDay; i++) {
        this.dates.monthList.unshift('');
      }
      for (let i = 0; i < this.dates.lastMonthDay; i++) {
        this.dates.monthList.push('');
      }
      let len = this.dates.monthList.length;
      let n = 7; // 假设每行显示4个
      let lineNum = len % 4 === 0 ? len / 4 : Math.floor(len / 4 + 1);
      let res = [];
      for (let i = 0; i < lineNum; i++) {
        // slice() 方法返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组对象。且原始数组不会被修改。
        let temp = this.dates.monthList.slice(i * n, i * n + n);

        let tempDate = [];
        temp.forEach(element => {
          tempDate.push({
            date: element,
            active: false,
            disabled: false
          });
        });
        res.push({
          date: {
            date: nstr,
            year: ynow,
            month: mnow,
            ri: dnow
          },
          day: tempDate
        });
      }
      this.dates.monthList = res;
    },
    is_leap(year) {
      // 是否为闰年

      let res; // eslint-disable-line no-unused-vars
      return year % 100 === 0
        ? (res = year % 400 === 0 ? 1 : 0)
        : (res = year % 4 === 0 ? 1 : 0);
    },
    getDateClick(_indexParent, _indexChild, _disabled, _parentData) {
      if (_disabled) return;
      // 点击某个日期选中
      this.dates.monthList.forEach(element => {
        if (element.day.length !== 0) {
          element.day.forEach(elementChild => {
            elementChild.active = false;
          });
        }
      });
      this.$set(
        this.dates.monthList[_indexParent].day[_indexChild],
        'active',
        true
      );

      this.getActiveDate(
        this.dates.monthList[_indexParent].day[_indexChild].date
      );
      this.dates.show = false;
    },
    getActiveDate(_value) {
      // 渲染选中的数据
      let _date = new Date(this.dateData.dateValue);
      _date.setDate(_value);
      this.dates.dateValue = this.formatDate(_date, 'yyyy-MM-dd');
      this.$emit('handleClick', _date);
    },
    formatDate(date, fmt) {
      // 日期格式化
      // author: meizz
      if (this.isEmpty(date)) return;
      var o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds() // 毫秒
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
            RegExp.$1.length === 1
              ? o[k]
              : ('00' + o[k]).substr(('' + o[k]).length)
          );
        }
      }
      return fmt;
    },
    isEmpty(keys) {
      if (typeof keys === 'string') {
        keys = keys.replace(/\"|&nbsp;|\\/g, '').replace(/(^\s*)|(\s*$)/g, '');
        if (
          keys === '' ||
          keys === null ||
          keys === 'null' ||
          keys === 'undefined'
        ) {
          return true;
        } else {
          return false;
        }
      } else if (typeof keys === 'undefined') {
        // 未定义
        return true;
      } else if (typeof keys === 'number') {
        return false;
      } else if (typeof keys === 'boolean') {
        return false;
      } else if (typeof keys === 'object') {
        if (JSON.stringify(keys) === '{}') {
          return true;
        } else if (keys === null) {
          // null
          return true;
        } else {
          return false;
        }
      }

      if (keys instanceof Array && keys.length === 0) {
        // 数组
        return true;
      }
    }
  }
};
</script>
<style lang="scss" scoped></style>
