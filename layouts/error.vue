<template>
  <div class="__nuxt-error-page">
    <div class="error">
      <div class="code">{{error.code}}</div>
      <div class="title">{{ error.message }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NuxtError',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  computed: {
   
   
  },
  head () {
    return {
      title: this.message,
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0'
        }
      ]
    }
  }
}
</script>

<style lang="less">
.__nuxt-error-page {
  padding: 1rem;
  background: #F7F8FB;
  color: #47494E;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: sans-serif;
  font-weight: 100 !important;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
   .error {
  max-width: 450px;
  .code{
      font-size:20px;
  }
  .title {
  font-size: 24px;
  margin-top: 15px;
  color: #47494E;
  margin-bottom: 8px;
}
}

}




</style>