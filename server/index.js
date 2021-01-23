const Koa = require('koa')
const { Nuxt ,Builder } = require('nuxt')
async function start () {
  const app = new Koa()
  
  // Import and Set Nuxt.js options
  const config = require('../nuxt.config.js')
 

const host = config.server.host || '127.0.0.1'
  const port = config.server.port || 3000
  console.log("config:",config.server.host,config.server.port)
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)
  console.log('config.dev:',config.dev)
  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(ctx => {
    ctx.status = 200
    ctx.respond = false // Mark request as handled for Koa
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
}

start()