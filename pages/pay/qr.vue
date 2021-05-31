<template>
  <div></div>
</template>

<script>
import orderApi from "../../api/order";
export default {
  async asyncData({ req, query, $axios, error, redirect, $sentry }) {
    try {
    } catch (err) {
      error({
        statusCode: 500,
        code: err.data.code,
        message: err.data.message,
      });
    }
  },
  data() {
    return {};
  },
  head() {},
  computed: {},
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
</style>
