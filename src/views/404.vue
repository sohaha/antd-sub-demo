<template>
  <div>404 <input v-model="title" type="text" placeholder="设置标题" ></div>
</template>

<script>
export default {
  name: 'Exp404',
  components: {},
  data() {
    return {
      title: '',
    };
  },
  watch: {
    title(title) {
      this.setTabTitle(title);
    },
  },
  methods: {
    setTabTitle(title) {
      this.$microSetHtmlTitle(title);
    },
  },
};
</script>

<style scoped></style>
