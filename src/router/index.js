import Page from '@/components/Page';
import { warn } from '@/lib/debug';
import Router from 'vue-router';
import Vue from 'vue';

Vue.use(Router);

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (
      err?.message.indexOf('Avoided redundant navigation to current') === -1
    ) {
      warn(err);
    }
  });
};

// noinspection JSUnresolvedFunction
const files = require.context('./modules', false, /\.js$/);
const routerMap = [];

files.keys().forEach(key => {
  let name = key.replace(/(\.\/|\.js)/g, '');
  const rules = files(key).default;
  if (name === 'index') {
    name = '/';
  }
  routerMap[name] = rules;
});

const baseRoutes = [
  {
    path: '/',
    component: Page,
    children: [],
  },
];

const children = baseRoutes[0].children || [];
Object.keys(routerMap)
  .sort()
  .forEach(key => {
    const item = routerMap[key];
    children.push({
      path: key,
      ...item,
    });
  });

children.push({
  path: '*',
  name: '页面消失了',
  component: () => import('@/views/404'),
});

baseRoutes[0].children = children;

export default baseRoutes;
