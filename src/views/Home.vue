<template>
  <div id="app">
    <a-space direction="vertical">
      <div v-if="hasNotice">
        <a-alert message="收到传递过来的信息" type="success" show-icon />
        {{ $root.noticeState }}
      </div>
      <div v-else>暂无传递的数据</div>
      <a-input v-model="title" type="text" placeholder="设置标题" />
    </a-space>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {},
  data() {
    return { title: '' };
  },
  computed: {
    hasNotice() {
      return this.$root.noticeState.length > 0;
    },
  },
  watch: {
    title(title) {
      this.setTabTitle(title);
    },
  },
  mounted() {
    console.log(
      '获取主应用的 store state',
      JSON.stringify(Object.keys(this.$store.state?.global || {}))
    );
    // 手动设置页面标题 和 tab 栏标题
    this.$microSetHtmlTitle('rand' + Number(new Date()));
  },
  methods: {
    setTabTitle(title) {
      this.$microSetHtmlTitle(title);
    },
    emitGlobal() {
      console.log('通知主应用');
      this.$store.commit('global/emit', {
        method: 'test',
        name: Number(new Date()),
      });
    },
  },
};
</script>

<style lang="less" scoped>
#app {
  img {
    width: 50px;
    height: 50px;
  }
}
</style>
