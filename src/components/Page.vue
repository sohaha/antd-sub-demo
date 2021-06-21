<template>
  <div class="page-main">
    <navigate />

    <keep-alive>
      <!-- 必须指定 key 为 fullPath -->
      <router-view :key="$route.fullPath" />
    </keep-alive>
  </div>
</template>

<script>
import Navigate from './Navigate';
export default {
  name: 'Page',
  components: { Navigate },
};
</script>

<style scoped></style>
