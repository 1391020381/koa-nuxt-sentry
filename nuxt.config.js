
const path = require('path');
const { format, transports }  = require('winston') ;
const { combine, timestamp,label,prettyPrint } = format;
require('winston-daily-rotate-file');

const staticUrlList = {
  'local': '',
  'dev': "//dev-static3.iask.cn",
  'test': "//test-static3.iask.cn",
  'pre': "//pre-static3.iask.cn",
  'prod': "//static3.iask.cn"
};
const pkg = require('./package.json');
const release = pkg.name + '-' + pkg['ishare-payment-system-vsersion'];

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
      sourceMapStyle:'source-map'
    }, 
  },
  winstonLog: {
    autoCreateLogPath:true,
    useDefaultLogger: false,
    loggerOptions: {
      format: combine(
        label({ label: 'ishare-payment-system' }),
        timestamp(),
        prettyPrint()
      ),
      transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
          format: combine(timestamp({
            format:'YYYY-MM-DD HH:mm:ss'
        })),
          level: 'info',
          filename: process.env.NODE_ENV == 'local'?path.join(__dirname,'/data/logs/ishare-payment-system/%DATE%.log'):'/data/logs/ishare-payment-system/%DATE%.log',
          maxsize: 5 * 1024 * 1024  // 这个是限制日志文件的大小
        }),
        new transports.DailyRotateFile({
          format: combine(timestamp({
            format:'YYYY-MM-DD HH:mm:ss'
        })),
          level: 'error',
          filename:  process.env.NODE_ENV == 'local'?path.join(__dirname,'/data/logs/ishare-payment-system/error-%DATE%.log'):'/data/logs/ishare-payment-system/error-%DATE%.log',
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
    proxy:true,
    retry: { retries: 3 }
  },
  proxy:{
    '/openapi':'http://dev-open-ishare.iask.com.cn'
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    /*
   ** 您可以在这里扩展webpack配置
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
      if (!isDev) {
       config.devtool = 'source-map';
        config.output.publicPath = staticUrlList[process.env.NODE_ENV] + '/ishare-payment/';
        const SentryPlugin = require('@sentry/webpack-plugin');
        config.plugins.push(new SentryPlugin({
          include: '.nuxt/dist/', // 要上传的文件夹
          release,
          configFile:(process.env.NODE_ENV != 'prod'&&process.env.NODE_ENV!='pre')?'.dev-sentryclirc':'.sentryclirc',
          urlPrefix: '~/_nuxt/' // ~/为网站根目录，后续路径须对应source
        }));
      }else{
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
