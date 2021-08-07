<template>
  <a-space direction="vertical">
    <div>{{ title }} {{ $route.fullPath }}</div>
    <div>接收到的数据: {{ $root.noticeState }}</div>
    <a-space>
      <div>
        <a-button @click="goApi">请求接口</a-button>
      </div>
      <a-input v-model="data" type="text" />
      <a-button @click="send">给 Home 发送数据</a-button>
    </a-space>
    <a-space>
      <a-button @click="goAndSend">跳转到 /app2/demo 并且传递数据</a-button>
    </a-space>
  </a-space>
</template>

<script>
import { getRoutesConfig } from '@/api/user';
export default {
  name: 'Demo',
  data() {
    return {
      title: 'Demo',
      data: '发送数据',
    };
  },
  methods: {
    send() {
      this.$microSendNotice(this.data, '/', true);
      this.$message.success('给 Home 发送了数据，请点击 “Go Home” 查看效果');
    },
    goAndSend() {
      this.$microGoto('/app2/demo', '子应用跳转并且传递数据');
    },
    async goApi() {
      const data = await getRoutesConfig();
      this.title = data;
    },
  },
};
</script>

<style></style>
