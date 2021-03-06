
const path = require('path');
const { format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;
require('winston-daily-rotate-file');

const staticUrlList = {
  'local': '',
  'dev': "//dev-static3.iask.cn",
  'test': "//test-static3.iask.cn",
  'pre': "//pre-static3.iask.cn",
  'prod': "//static3.iask.cn"
};
const pkg = require('./package.json');
const release = pkg.name + '-' + pkg['version'];

function getFilename() {
  let filename = '';
  let NODE_ENV = process.env.NODE_ENV;
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
      filename = ".env.prod";
  }
  console.log('filename:', filename);
  return filename;
}

module.exports = {
  dev: process.env.NODE_ENV == 'local',
  loading: {
    color: '#f25125',
    height: '1px'
  },
  telemetry: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'koa-nuxt-sentry',
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

    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    { src: '~assets/css/public.less', lang: 'less' }
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vconsole.js', ssr: false },
    { src: '~/plugins/axios.js', ssr: true }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    'nuxt-winston-log',
    '@nuxtjs/sentry',
    '@nuxtjs/axios',
    '@nuxtjs/toast',
    ['@nuxtjs/dotenv', {
      filename: getFilename()
    }]
  ],
  sentry: { // http://ab87976d45d8457dbe05c7b795de0dcd@192.168.1.199:9000/7
    dsn: process.env.NODE_ENV != 'prod' && process.env.NODE_ENV != 'pre' ? "http://ab87976d45d8457dbe05c7b795de0dcd@192.168.1.199:9000/7" : "", // Enter your project's DSN here
    config: {
      release: release,
      publishRelease: true,
      sourceMapStyle: 'source-map'
    },
  },
  winstonLog: {
    autoCreateLogPath: true,
    useDefaultLogger: false,
    loggerOptions: {
      format: combine(
        label({ label: 'koa-nuxt-system' }),
        timestamp(),
        prettyPrint()
      ),
      transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
          format: combine(timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
          })),
          level: 'info',
          filename: process.env.NODE_ENV == 'local' ? path.join(__dirname, '/data/logs/koa-nuxt-sentry/%DATE%.log') : '/data/logs/koa-nuxt-sentry/%DATE%.log',
          maxsize: 5 * 1024 * 1024  // ????????????????????????????????????
        }),
        new transports.DailyRotateFile({
          format: combine(timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
          })),
          level: 'error',
          filename: process.env.NODE_ENV == 'local' ? path.join(__dirname, '/data/logs/koa-nuxt-sentry/error-%DATE%.log') : '/data/logs/koa-nuxt-sentry/error-%DATE%.log',
          maxsize: 5 * 1024 * 1024
        })
      ]
    }
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
    proxy: true,
    retry: { retries: 3 }
  },
  proxy: {
    '/openapi': 'http://dev-open-ishare.iask.com.cn'
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    /*
   ** ????????????????????????webpack??????
  */
    extractCSS: true,
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.(css|vue)$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    },
    extend(config, { isDev, isClient }) {
      console.log('isDev:', isDev, isClient);
      if (isClient && !isDev) {
        config.devtool = 'source-map';
        config.output.publicPath = staticUrlList[process.env.NODE_ENV] + '/koa-nuxt-sentry/';
        const SentryPlugin = require('@sentry/webpack-plugin');
        config.plugins.push(new SentryPlugin({
          include: '.nuxt/dist/', // ?????????????????????
          release,
          configFile: (process.env.NODE_ENV != 'prod' && process.env.NODE_ENV != 'pre') ? '.dev-sentryclirc' : '.sentryclirc',
          urlPrefix: '~/_nuxt/' // ~/??????????????????????????????????????????source
        }));
      }
      if (isDev) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
    }
  },
  server: {
    port: 3333, // default: 3000
    host: '0.0.0.0' // default: localhost
  }
};
