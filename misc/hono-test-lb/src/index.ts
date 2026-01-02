import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { corsSettings } from './global/config.js'
import { secureHeaders } from 'hono/secure-headers'
import { timeout } from 'hono/timeout'
import { prettyJSON } from 'hono/pretty-json'

import todos from './routes/todos/handlers.js'

const app = new Hono().basePath('/api')

// middleware
app.use('/api/*', cors(corsSettings))
app.use('/api/*', secureHeaders())
app.use('/api/*', timeout(5000))
app.use("/api/*", prettyJSON())



//routes
app.route('/todos', todos)


app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404))
//catchall error handler
app.onError((err, c) => {
  console.error(err)
  return c.json({ error: 'internal server error' }, 500)
})


serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
