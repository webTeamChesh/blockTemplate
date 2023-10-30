'use strict';

const stripP = (str) => {
  return str ? str.replace(/(&nbsp;)?<\/?p[^>]*>/g, '') : '';
};

const makePages = (arr, pageSize) => {
  let count = arr.length;
  let pageCount = Math.ceil(count / pageSize);
  let btns = Array.from({ length: pageCount }, (_, i) => i + 1);
  let pages = [...Array(pageCount)].map(() => arr.splice(0, pageSize));
  return { btns, pages };
};

const formatDate = (d) => {
  return d.toLocaleDateString('en-GB');
};

const addDates = (obj) => {
  obj.expiryDate = new Date(obj.expiryDate);
  obj.expDate = formatDate(obj.expiryDate);
  return obj;
};

const addIndex = (arr) => {
  arr.forEach((e, i) => (e.index = i));
};

export { addIndex, makePages, addDates, formatDate };
