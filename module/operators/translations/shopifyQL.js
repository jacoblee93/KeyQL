const moment = require('moment');
moment.suppressDeprecationWarnings = true;

const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';

const escapeSpecialChars = (term) => term.toString().replace(/\\/g, '\\\\').replace(/:/g, '\\:').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

const formatDateTime = (dateTime) => dateTime.format(DATE_TIME_FORMAT).replace(/\+00:00/g, 'Z');

module.exports = {
  'is': (a, b) => `${a}:"${escapeSpecialChars(b)}"`,
  'not': (a, b) => `-${a}:"${escapeSpecialChars(b)}"`,
  'gt': (a, b) => `${a}:>"${escapeSpecialChars(b)}"`,
  'lt': (a, b) => `${a}:<"${escapeSpecialChars(b)}"`,
  'gte': (a, b) => `${a}:>="${escapeSpecialChars(b)}"`,
  'lte': (a, b) => `${a}:<="${escapeSpecialChars(b)}"`,
  'icontains': (a, b) => { throw new Error('Operator `icontains` not supported by Shopify') },
  'contains': (a, b) => { throw new Error('Operator `contains` not supported by Shopify') },
  'startswith': (a, b) => { throw new Error('Operator `startswith` not supported by Shopify') },
  'istartswith': (a, b) => `${a}:\\"${escapeSpecialChars(b)}\\"*`,
  'endswith': (a, b) => { throw new Error('Operator `endswith` not supported by Shopify') },
  'iendswith': (a, b) => { throw new Error('Operator `iendswith` not supported by Shopify') },
  'is_null': (a, b) => `-${a}:*`,
  'is_true': (a, b) => `${a}:true`,
  'is_false': (a, b) => `${a}:false`,
  'not_null': (a, b) => `${a}:*`,
  'not_true': (a, b) => `-${a}:true`,
  'not_false': (a, b) => `-${a}:false`,
  'in': (a, b) => '(' + b.map(elem => `${a}:"${escapeSpecialChars(elem)}"`).join(' OR ') + ')',
  'not_in': (a, b) => '(' + b.map(elem => `-${a}:"${escapeSpecialChars(elem)}"`).join(' AND ') + ')',
  'recency_lt': (a, b) => {
    let nowUTC = moment.utc(moment.now());
    let cutOff;
    try {
      cutOff = formatDateTime(moment(nowUTC).subtract(b, 'seconds'));
    } catch (e) {
      return '';
    }
    return `${a}:>"${cutOff}" AND ${a}:<="${formatDateTime(nowUTC)}"`;
  },
  'recency_lte': (a, b) => {
    let nowUTC = moment.utc(moment.now());
    let cutOff;
    try {
      cutOff = formatDateTime(moment(nowUTC).subtract(b, 'seconds'));
    } catch (e) {
      return '';
    }
    return `${a}:>="${cutOff}" AND ${a}:<="${formatDateTime(nowUTC)}"`;
  },
  'recency_gt': (a, b) => {
    let nowUTC = moment.utc(moment.now());
    let cutOff;
    try {
      cutOff = formatDateTime(moment(nowUTC).subtract(b, 'seconds'));
    } catch (e) {
      return '';
    }
    return `${a}:<"${cutOff}"`;
  },
  'recency_gte': (a, b) => {
    let nowUTC = moment.utc(moment.now());
    let cutOff;
    try {
      cutOff = formatDateTime(moment(nowUTC).subtract(b, 'seconds'));
    } catch (e) {
      return '';
    }
    return `${a}:<="${cutOff}"`;
  },
  'upcoming_lt': (a, b) => {
    let nowUTC = moment.utc(moment.now());
    let cutOff;
    try {
      cutOff = formatDateTime(moment(nowUTC).add(b, 'seconds'));
    } catch (e) {
      return '';
    }
    return `${a}:>="${formatDateTime(nowUTC)}" AND ${a}:<"${cutOff}"`;
  },
  'upcoming_lte': (a, b) => {
    let nowUTC = moment.utc(moment.now());
    let cutOff;
    try {
      cutOff = formatDateTime(moment(nowUTC).add(b, 'seconds'));
    } catch (e) {
      return '';
    }
    return `${a}:>="${formatDateTime(nowUTC)}" AND ${a}:<="${cutOff}"`;
  },
  'upcoming_gt': (a, b) => {
    let nowUTC = moment.utc(moment.now());
    let cutOff;
    try {
      cutOff = formatDateTime(moment(nowUTC).add(b, 'seconds'));
    } catch (e) {
      return '';
    }
    return `${a}:>"${cutOff}"`;
  },
  'upcoming_gte': (a, b) => {
    let nowUTC = moment.utc(moment.now());
    let cutOff;
    try {
      cutOff = formatDateTime(moment(nowUTC).add(b, 'seconds'));
    } catch (e) {
      return '';
    }
    return `${a}:>="${cutOff}"`;
  },
  'date_lt': (a, b) => {
    try {
      date = escapeSpecialChars(formatDateTime(moment.parseZone(b)));
    } catch (e) {
      return '';
    }
    return `${a}:<"${date}"`;
  },
  'date_lte': (a, b) => {
    try {
      date = escapeSpecialChars(formatDateTime(moment.parseZone(b)));
    } catch (e) {
      return '';
    }
    return `${a}:<="${date}"`;
  },
  'date_gt': (a, b) => {
    try {
      date = escapeSpecialChars(formatDateTime(moment.parseZone(b)));
    } catch (e) {
      return '';
    }
    return `${a}:>"${date}"`;
  },
  'date_gte': (a, b) => {
    try {
      date = escapeSpecialChars(formatDateTime(moment.parseZone(b)));
    } catch (e) {
      return '';
    }
    return `${a}:>="${date}"`;
  }
};
