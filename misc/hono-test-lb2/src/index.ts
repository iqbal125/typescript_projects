import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()


interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

const testDB: Task[] = []

//task management api 

// CRUD endpoints for task management


// {
//   "id": "string (auto-generated)",
//   "title": "string (required, max 100 chars)",
//   "description": "string (optional)",
//   "status": "pending | in_progress | completed",
//   "priority": "low | medium | high",
//   "dueDate": "ISO 8601 date string (optional)",
//   "createdAt": "ISO 8601 timestamp",
//   "updatedAt": "ISO 8601 timestamp"
// }


const priorityEnums = ['low', 'medium', 'high']
const statusEnums = ["pending", "in_progress", "completed"]


interface CreateTaskI {
  title: string,
  description?: string,
  priority?: 'low' | 'medium' | 'high',
  status?: "pending" | "in_progress" | "completed",
  dueDate?: string,
}


app.post("/tasks", async (c) => {
  // runtime validation with zod for real project, keep as is for interview
  const body: CreateTaskI = await c.req.json()

  // need from client title, description, priority (default low), dueDate (optional), 
  if (!body.title) {
    console.error("Request Id: set_request_ID_Here" + "Missing Fields")
    return c.json({ status: "Error", message: "Missing Fields" }, 400)
  }

  if (body.title.length > 100) {
    console.error("Request Id: set_request_ID_Here" + "Title length too long")
    return c.json({ status: "Error", message: "Title length too long" }, 400)
  }

  if (
    (body.priority && !priorityEnums.includes(body.priority)) ||
    (body.status && !statusEnums.includes(body.status))
  ) {
    return c.json({ status: "Error", message: "Invalid values" }, 400)
  }

  const id = Math.random().toString().substring(2, 15)
  const description = body?.description
  const status = body?.status ?? "in_progress";
  const priority = body?.priority ?? "medium";
  const dueDate = body?.dueDate
  const createdAt = new Date().toISOString()
  const updatedAt = new Date().toISOString()

  const { title } = body

  const task = {
    id,
    title,
    description,
    priority,
    status,
    dueDate,
    createdAt,
    updatedAt
  }

  testDB.push(task)

  return c.json({ status: "Success", task }, 201)
})


//need id to look up task
// if no id, return 400
//if not found return 404

app.get('/tasks/:id', (c) => {
  const id = c.req.param('id') //is string

  if (!id) {
    console.error('missing id param')
    return c.json({ status: "Error", message: "missing id param" }, 400)
  }

  const task = testDB.find(task => task.id === id)
  if (!task) {
    console.log('task not found' + id)
    return c.json({ status: "Error", message: "Task not found" }, 404)
  }

  return c.json({ status: "Success", task })
})



//get all endpoint
//allow search
//allow pagination, default to 1
//limit

// query params needed: page, limit, search. 
// return hasNextPage. 

app.get('/tasks', c => {
  const page = Number(c.req.query("page")) || 1
  const limit = Number(c.req.query("limit")) || 10
  const search = c.req.query("search")

  let result = testDB

  if (search) {
    result = result.filter(task => task.title.includes(search))
  }

  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  result = result.slice(startIndex, endIndex)

  return c.json({ result })
})

// need title from body
// status
// check if exsits, 404 if not
// conditionally update the sent properties
// 


app.put('/tasks/:id', async c => {
  const body = await c.req.json()
  const taskId = c.req.param("id")

  const existingTask = testDB.find(task => task.id === taskId)
  if (!existingTask) {
    return c.json({ status: "Error", message: "Task not found" }, 404)
  }

  const title = body.title ?? existingTask.title
  const description = body.description ?? existingTask.description
  const status = body.status ?? existingTask.status
  const updatedAt = new Date().toISOString()

  const updatedTask = {
    title,
    description,
    status,
    updatedAt
  }

  const taskIndex = testDB.findIndex(task => task.id === taskId)
  if (taskIndex === -1) {
    return c.json({ status: "Error", message: "something went wrong" })
  }

  testDB[taskIndex] = { ...existingTask, ...updatedTask, }

  return c.json({ status: "Success" })
})


app.get("/external", c => {

  try {
    const response = fetch("http://example.com/test", {
      method: "GET",
    })


    const postResponse = fetch("http://jsonplaceholder", {
      method: "POST",
      body: JSON.stringify({ test: "test" })
    })

  } catch {

  }

  return c.json({})
})



serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
