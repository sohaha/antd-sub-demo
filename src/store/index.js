import Vue from 'vue';
import Vuex from 'vuex';

// noinspection JSUnresolvedFunction
const files = require.context('./modules', false, /\.js$/);
export const modules = {};

files
  .keys()
  .sort()
  .forEach(key => {
    const name = key.replace(/(\.\/|\.js)/g, '');
    modules[name] = files(key).default;
  });

Vue.use(Vuex);

const store = new Vuex.Store({ modules: modules });

export default store;
