import Vue from 'vue';
import store from '@/store';
import Router from 'vue-router';
import App from '@/App';
import baseRoutes from '@/router';
import { log } from '@/lib/debug';
import { loadInterceptors } from '@/utils/request';
import {
  initSingle,
  isSingle,
  bindInstance
} from '@/lib/subApp/singleBootstrap';
export {
  bootstrap,
  update,
  mount,
  unmount
} from '@/lib/subApp/singleBootstrap';

import '@/components/lazy';

Vue.config.productionTip = false;

function render(props = {}) {
  const { container, routerBase, appName } = props;
  const routesPrefix = isSingle() ? routerBase : '/';
  const router = new Router({
    mode: 'history',
    base: routesPrefix,
    routes: baseRoutes,
  });

  store.commit('systems/initState', { appName, routesPrefix, visible: true });

  bindInstance({ router });
  loadInterceptors({ router, store });

  const instance = new Vue({
    data() {
      return {
        noticeState: [],
        done: false,
        nextPath: '',
        loading: false,
      };
    },
    computed: {
      show() {
        return this.$store.state.systems.visible;
      },
      appsState() {
        return this.$globalStore?.state?.setting?.appsState || {};
      },
    },
    watch: {
      appsState: {
        handler(val) {
          this.$nextTick(() => {
            if (val[appName]) {
              this.$store.commit('systems/setVisible', val[appName].show);
            }
          });
        },
        deep: true,
        immediate: true,
      },
      noticeState: {
        handler(val) {
          console.log('收到的消息', JSON.stringify(val));
        },
        deep: true,
      },
      show(val) {
        if (val) {
          this.getNoticeState();
        }
      },
      '$route.fullPath': {
        handler(n, o) {
          const name = this.$route.name;
          if (name) {
            if (isSingle()) {
              setTimeout(() => {
                this.$microSetHtmlTitle(name);
              });
            } else {
              this.$microSetHtmlTitle(name);
            }
          }
          if (this.nextPath === n) {
            return;
          }
          this.nextPath = n;
          if (this.show) {
            this.getNoticeState();
          }
        },
        immediate: true,
      },
    },
    mounted() {},
    methods: {
      async getNoticeState() {
        if (this.loading) {
          return;
        }
        this.loading = true;
        try {
          this.noticeState = (await this.$microNotice()) || [];
          await this.$microEmit('removeNotice');
        } catch (err) {
          console.warn(err);
        }
        this.$nextTick(() => {
          this.loading = false;
        });
      },
    },
    router,
    store,
    render: h => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app');

  router.beforeEach((to, from, next) => {
    log(`[${appName}] Goto: `, from.path, '->', to.path);
    if (!instance.show) {
      return;
    }
    next();
  });
  router.afterEach((to, from) => {});

  return { instance, router };
}

initSingle({ store, render });
