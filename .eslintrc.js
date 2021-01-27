module.exports = {
    root: true,
    env: {
      browser: true,
      node: true
    },
    parserOptions: {
      parser: 'babel-eslint'
    },
    extends: [
      'eslint:recommended',
      // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
      // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
      'plugin:vue/recommended'
    ],
    // 校验 .vue 文件
    plugins: ['vue'],
    // 自定义规则
    rules: {
      semi: [2, 'always'],
      'no-console': 'off',
      'vue/max-attributes-per-line': 'off'
    },
    globals:{
      WeixinJSBridge:true,
      ap:true,
      _hmt:true
    }
  };