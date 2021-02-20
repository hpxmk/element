import DateWeek from './src/date';

/* istanbul ignore next */
DateWeek.install = function install(Vue) {
  Vue.component(DateWeek.name, DateWeek);
};

export default DateWeek;
