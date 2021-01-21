

function getFilename(){
  let filename = ''
  let NODE_ENV =  process.env.NODE_ENV
  switch(NODE_ENV){
        case 'prod':
          filename = '.env.prod';
        break;
        case 'pre':
          filename = ".env.pre" ;
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
  console.log('filename:',filename)
  return filename
}

module.exports =  {
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
    script:[
      { src: '/rem/index.js', type: 'text/javascript', charset: 'utf-8' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    {src:'~assets/css/public.less',lang:'less'}
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/toast',
    ['@nuxtjs/dotenv', {
      filename: getFilename()
   }]
  ],
  axios:{
    retry: { retries: 3 }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
     /*
    ** 您可以在这里扩展webpack配置
   */
  
  }
}
