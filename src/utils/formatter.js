import moment from 'moment';
import { isPlainObject, isFunction, isEmpty } from 'lodash';
import 'moment/locale/es';

const formatter = {
  getNumberOfDay(date) {
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
  },
  getNumberOfWeek(date) {
    const tdt = new Date(date.valueOf());
    const dayn = (date.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);
    const firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);

    if (tdt.getDay() !== 4) {
      tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
    }

    return 1 + Math.ceil((firstThursday - tdt) / 604800000);
  },
  date(date, formatString = 'D MMMM YYYY') {
    if (!date) return '';

    moment.locale('es');
    return moment(date).format(formatString);
  },
  shortDate(date, formatString = 'D/MMM/YY') {
    if (!date) return '';

    moment.locale('es');
    return moment(date).format(formatString);
  },
  messageDate(date, formatString = 'D MMM, h:mm a') {
    if (!date) return '';
    moment.locale('es');
    return moment(date).format(formatString);
  },
  commentDate(date, formatString = 'D/MMM/YY, h:mm a') {
    if (!date) return '';
    moment.locale('es');
    return moment(date).format(formatString);
  },
  time(date, formatString = 'HH:mm') {
    if (!date) return '';

    moment.locale('es');
    return moment(date).format(formatString);
  },
  currency(number = 0) {
    let value = parseFloat(number);
    let decimals = 0;

    if (value >= 10 && value <= 100) {
      decimals = 1;
    } else if(value < 10) {
      decimals = 2;
    }

    const formattedNumber = `$${value.toFixed(decimals).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}`;
    return formattedNumber;
  },
  thousandSeparator(number = 0) {
    let value = parseFloat(number);
    let decimals = 0;

    if(!Number.isInteger(value)){
      if (value >= 10 && value <= 100) {
        decimals = 1;
      } else if(value < 10) {
        decimals = 2;
      }
    }

    const formattedNumber = `${value.toFixed(decimals).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}`;
    return formattedNumber;
  },
  capitalize(text = '', type) {
    if (!text) return '';

    if (text && !text.length) {
      return text;
    }

    if (text.length === 1) {
      return text.toUpperCase();
    }

    if (type === 'sub') {
      return text;
    }

    const firstLetter = text.substring(0, 1);
    const remainingText = text.substring(1);
    return `${firstLetter.toUpperCase()}${remainingText}`;
  },
  clean(object) {
    const result = {};
    const objectAttributes = Object.keys(object);

    objectAttributes.forEach((attribute) => {
      const attributeValue = object[attribute];

      if (isPlainObject(attributeValue)) {
        result[attribute] = formatter.clean(attributeValue);
      } else if (!isFunction(attributeValue)) {
        result[attribute] = attributeValue;
      }
    });

    return result;
  },
  applyMask(mask = '', number = '') {
    const maskArray = mask.split('');
    const numericValueArray = number.toString().split('');
    let maskedValue = '';
    let nextIndex = 0;

    maskArray.forEach((character) => {
      if (character === 'x') {
        maskedValue += numericValueArray[nextIndex];
        nextIndex += 1;
      } else {
        maskedValue += character;
      }
    });

    return maskedValue;
  },
  subString(text = '', maxLength = 50) {
    let shortString = text;

    if (shortString.length > maxLength) {
      shortString = `${shortString.substring(0, maxLength)}...`;
    }

    return shortString;
  },
  isLeapYear(year) {
    const checkYear = (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) ? 1 : 0;
    if (!checkYear) { return false; }
    return true;
  },
  slugify(rawText) {
    let str = rawText;
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to = "aaaaaaeeeeiiiioooouuuunc------";

    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-") // collapse dashes
      .replace(/^-+/, "") // trim - from start of text
      .replace(/-+$/, ""); // trim - from end of text

    return str;
  },
  strongify(text = '', key) {
    // const regex = new RegExp(`\\${key}\\`, 'gi');
    const regex = /EMEAT/gi;
    const word = `<span style={{ color: '#BF0A30', fontSize: 16 }}>${key.substring(0, 1)}</span><span style={{ fontSize: 17, fontWeight:'bold' }}>${key.substring(1, 2)}</span><span style={{fontWeight:'bold', fontSize: 16 }}>${key.substring(2, 5)}</span>`;
    if (text.indexOf(key)) {
      const replace = text.replaceAll(regex, word);
      return window.HTMLReactParser(replace);
    }
    return '';
  },
  limit(array, maxItems) {
    const response = [];

    for (let i = 0; i < maxItems; i++) {
      if (i < array.length) {
        response.push(array[i]);
      }
    }

    return response;
  },
  monthOfYear: (index = 0) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    return months[index];
  },
  monthOfYearShort: (index = 0) => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];

    return months[index];
  },
  toQueryParams: (path) => {
    let query = '';

    if (!isEmpty(Object.keys(path))) {
      Object.keys(path)
        .forEach((key) => {
          query += `${key}=${path[key]}&`;
        });

      query = `?${query.slice(0, -1)}`;
    }

    return query;
  },
  toQueryParamsEncodeURI: (path) => {
    let query = '';

    if (!isEmpty(Object.keys(path))) {
      Object.keys(path)
        .forEach((key) => {
          query += `${key}=${encodeURIComponent(path[key])}&`;
        });

      query = `?${query.slice(0, -1)}`;
    }

    return query;
  },
  readPathQueryParams(path) {
    if (!path.length) return {};
    const query = path.substring(1);
    const params = query.split('&');

    const paramsData = {};
    params.forEach((qr) => {
      const data = qr.split('=');
      paramsData[data[0]] = data[1];
    });

    return paramsData;
  },
  haveChangeValueTable(items) {
    let value = false;
    items.forEach((dt) => {
      const changeValue = dt.last_weighted_average && dt.weighted_average;
      const average = Number(dt.weighted_average / 100);
      const lastAverage = Number(dt.last_weighted_average / 100);
      if (changeValue && (average - lastAverage)) {
        value = true;
      }
    });

    return value;
  },
  getMedian(data) {
    const array = data || [];

    const sorted = array.slice().sort((a, b) => {
      return a - b;
    });

    if (sorted.length % 2 === 0) {
      const first = sorted[sorted.length / 2 - 1];
      const second = sorted[sorted.length / 2];
      return (first + second) / 2;
    }

    const mid = Math.floor(sorted.length / 2);
    return sorted[mid];
  },
  getDateOfWeek(w, y) {
    var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week
    return new Date(y, 0, d);
  },
};


export default formatter;
