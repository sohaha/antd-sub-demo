<template>
  <div>
    <div>
      应用链接: <a class="link" :href="link" target="_blank"> {{ link }}</a>
    </div>
    <div>
      当前应用内跳转:
      <router-link to="/">Go Home</router-link>
      |
      <router-link to="/demo">Go Demo</router-link>
      |
      <a @click="goCurrent('/demo?id=2')">Go Demo2</a>
      |
      <router-link to="/bar">Go 404</router-link>
      |
      <router-link to="/list">Go 404-2</router-link>
    </div>
    <div>
      主应用内跳转:
      <a @click="goHome('/', '子应用跳转过来的')">Go Main Home</a> |
      <a @click="goHome('/demo', '子应用跳转过来的')">Go Main Demo</a> |
      <a @click="goHome('/demo404')">Go Main 404</a> |
      <a @click="goHome('/app/9001/demo')">Go Current Demo</a>
    </div>

    <a-space direction="vertical" @click="updateGlobalStore">
      <div>{{ globalAccount }}</div>
      <a-button>尝试更新主应用 Store</a-button>
    </a-space>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { isSingle } from '@/lib/subApp/singleBootstrap';
import { warn } from '@/lib/debug';

export default {
  name: 'Navigate',
  computed: {
    link() {
      // noinspection JSUnresolvedVariable
      return isSingle()
        ? window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ +
            this.$route.fullPath.substr(1)
        : location.href;
    },
    ...mapState('global', { globalAccount: state => state.account.user }),
  },
  methods: {
    updateGlobalStore() {
      const state = this.$store.state['global'];
      if (this.globalAccount) {
        state.account.user.name = new Date().getSeconds();
      }
    },
    goCurrent(path) {
      console.log('当前应用内跳转');

      this.$microGoto(path, '通过 $microGoto 跳转并且传递了数据', true);
    },
    goHome(path, notice) {
      console.log('主应用跳转');

      this.$microGoto(path, notice)
        .then(e => {})
        .catch(err => {
          warn(err);
        });
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: #1890ff;
  cursor: pointer;
  font-size: 16px;
}
div {
  padding: 10px;
}
</style>
