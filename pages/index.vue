<template>
  <div class="container">koa-nuxt-sentry</div>
</template>

<script>
export default {
  // eslint-disable-next-line
  async asyncData({ req, query, $axios, error, redirect, $sentry }) {
    // console.log(window);
  },
  data() {
    return {};
  },
};
</script>

<style  scoped>
.container {
  font-size: 24px;
}
</style>
