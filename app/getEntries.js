'use strict';

import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import { makePages, addDates, addIndex } from './helpers.js';
import { appInner, appOuter } from './ejsTemplates.js';
import listTemplate from './listTemplate.js';
import {
  includes,
  reachdeck,
  header,
  footer,
  cookies,
  site_search,
} from 'cec-block-templates';

import ejs from 'ejs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, '../public');
const ROOT_URL = `https://cms-chesheast.cloud.contensis.com/`;
const PROJECT = 'website';
const pageSize = 20;

async function getEntries(req, res) {
  const queries = req.url.split(/\?|&/);
  let entryId = queries.find((k) => k.startsWith('entryId'));
  // Abort if no entryID.
  if (!entryId) {
    res.sendFile(path.join(dir, 'index.html'));
    return;
  } else {
    entryId = entryId.slice(8);
  }

  // Get the entry from the query string.
  const resp = await fetch(
    `${ROOT_URL}/api/delivery/projects/${PROJECT}/entries/${entryId}/?accessToken=QCpZfwnsgnQsyHHB3ID5isS43cZnthj6YoSPtemxFGtcH15I`,
    { method: 'get' }
  );

  // Abort if no data from the CMS.
  if (resp.status !== 200) {
    res.sendFile(path.join(dir, 'index.html'));
    return;
  }

  let item = await resp.json();

  const title = item.entryTitle || '';
  const description = item.entryDescription || '';
  const contentType = item.contentTypeAPIName || '';
  const h1 = item.h1 || '';
  const introductoryText = item.introductoryText || '';

  const response = await fetch(
    `${ROOT_URL}/api/delivery/projects/${PROJECT}/contenttypes/${contentType}/entries?accessToken=QCpZfwnsgnQsyHHB3ID5isS43cZnthj6YoSPtemxFGtcH15I&pageSize=1000`,
    { method: 'get' }
  );
  // Abort if no data from the CMS.
  if (resp.status !== 200) {
    res.sendFile(path.join(dir, 'index.html'));
    return;
  }
  // Get the data
  const data = await response.json();
  let items = data.items.map((e) => addDates(e));
  addIndex(items);
  const { btns, pages } = makePages([...items], pageSize);

  // Create the app body by injecting the template.
  const appBody = ejs.render(appInner, { template: listTemplate });

  // Use this to create script tags to be added in the head element.
  let head_end = ejs.render(appOuter, {
    appBody,
    items,
    title,
    pages,
    btns,
    pageSize,
  });

  // Create a function with the app body.
  const createListApp = new Function(
    'items, title, pages, btns, pageSize, createSSRApp',
    appBody
  );

  // Make an instance of that function, with the data we need.
  const app = createListApp(items, title, pages, btns, pageSize, createSSRApp);

  // Render and send to client.
  renderToString(app).then((html) => {
    res.render('index', {
      includes,
      cookies,
      header,
      footer,
      site_search,
      reachdeck,
      description,
      title,
      h1,
      introductoryText,
      html,
      head_end,
    });
  });
}

export default getEntries;
