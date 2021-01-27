const staticUrlList = {
  'local': '',
  'dev': "//dev-static3.iask.cn",
  'test': "//test-static3.iask.cn",
  'pre': "//pre-static3.iask.cn",
  'prod': "//static3.iask.cn"
}
const pkg = require('./package.json')
function getFilename() {
  let filename = ''
  let NODE_ENV = process.env.NODE_ENV
  switch (NODE_ENV) {
    case 'prod':
      filename = '.env.prod';
      break;
    case 'pre':
      filename = ".env.pre";
      break;
    case "test":
      filename = ".env.test";
      break;
    case "dev":
      filename = ".env.dev";
      break;
    case "local":
      filename = ".env.local";
      break;
    default:
      filename = ".env.prod"
  }
  console.log('filename:', filename)
  return filename
}

module.exports = {
  // buildDir: 'isharePayment',
  dev: process.env.NODE_ENV == 'local',
  loading: {
    color: '#f25125',
    height: '1px'
  },
  telemetry: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '订单详情',
    htmlAttrs: {
      lang: 'zh-CN'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: staticUrlList[process.env.NODE_ENV] + '/ishare-payment/rem/index.js', type: 'text/javascript', charset: 'utf-8' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    { src: '~assets/css/public.less', lang: 'less' }
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vconsole.js', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/sentry',
    '@nuxtjs/axios',
    '@nuxtjs/toast',
    ['@nuxtjs/dotenv', {
      filename: getFilename()
    }]
  ],
  sentry: {
    dsn: process.env.NODE_ENV != 'prod' && process.env.NODE_ENV != 'pre' ? "http://ed6367bedee1470da3e967bf1ba58710@192.168.1.199:9000/5" : "", // Enter your project's DSN here
    config: {
      release: pkg.name + '-' + pkg.version,
      publishRelease: true,
      clientIntegrations: { RewriteFrames: {}, },
      serverIntegrations: { RewriteFrames: {}, }
    }, // Additional config
  },
  toast: {
    position: 'top-center',
    register: [
      {
        options: {
          type: 'error',
          duration: 2000
        }
      }
    ]
  },
  axios: {
    retry: { retries: 3 }
  },
  publicRuntimeConfig: {
    axios: {

    }
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    /*
   ** 您可以在这里扩展webpack配置
  */
    extend(config, { isDev, isClient }) {
      console.log('isDev:', isDev, isClient)
      if (isClient && !isDev) {

        config.devtool = 'source-map'
        config.output.publicPath = staticUrlList[process.env.NODE_ENV] + '/ishare-payment'
        const release = pkg.name + '-' + pkg.version
        console.log('release', release)
        const SentryPlugin = require('@sentry/webpack-plugin')
        config.plugins.push(new SentryPlugin({
          include: '.nuxt/dist/', // 要上传的文件夹
          release,
          configFile: '.sentryclirc',
          urlPrefix: '~/_nuxt/' // ~/为网站根目录，后续路径须对应source
        }))

        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        })
      }
    }
  },
  server: {
    port: 8089, // default: 3000
    host: '0.0.0.0' // default: localhost
  }
}
