import * as moment from 'moment';
export class DateUtils {
  static async diffMinsNow(date) {
    const now = moment(new Date()); //todays date
    const end = moment(date); // another date
    const duration = moment.duration(now.diff(end));
    const minutes = duration.asMinutes();
    return minutes;
  }
  static async diffSecondNow(date) {
    const now = moment(new Date()); //todays date
    const end = moment(date); // another date
    const duration = moment.duration(now.diff(end));
    const seconds = duration.asSeconds();
    return seconds;
  }
}
