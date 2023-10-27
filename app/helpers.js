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

export { makePages};
