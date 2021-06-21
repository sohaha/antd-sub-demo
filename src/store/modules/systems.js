// 和主应用交互使用
export default {
  namespaced: true,
  state: {
    visible: false,
    appName: '',
    routesPrefix: '',
  },
  getters: {},
  mutations: {
    setVisible(state, visible) {
      state.visible = visible;
    },
    initState(state, { appName, routesPrefix, visible }) {
      state.appName = appName;
      state.routesPrefix = routesPrefix;
      state.visible = visible;
    },
  },
};
