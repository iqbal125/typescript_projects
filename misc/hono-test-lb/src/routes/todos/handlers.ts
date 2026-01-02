import { Hono } from "hono";
import { rateLimit } from "../../utils/rateLimit";
import { mockApi } from "../../utils/mockApi";

interface TodoI {
    id: string;
    title: string;
    description: string;
    status: "pending" | "in-progress" | "completed";
    priority: "low" | "medium" | "high";
}

export const testDB: Array<TodoI> = [{
    "id": "123",
    "title": "test",
    "description": "test test",
    "status": "pending",
    "priority": "medium"
}]

const todos = new Hono()

// Apply rate limiting: 10 requests per minute
todos.use('*', rateLimit(10, 60000))

todos.get('/', (c) => {
    const search = c.req.query("search")
    const page = Number(c.req.query('page')) || 1
    const limit = Number(c.req.query("limit")) || 10
    const sortBy = c.req.query("sortBy") || "id" // id, title, description
    const sortOrder = c.req.query("sortOrder") || "asc" // asc, desc
    const groupBy = c.req.query("groupBy") // status, priority
    const status = c.req.query("status") // filter by status
    const priority = c.req.query("priority") // filter by priority

    // Filter by search
    let result = testDB
    if (search) {
        const searchLower = search.toLowerCase()
        result = result.filter(todo =>
            todo.id.toLowerCase().includes(searchLower) ||
            todo.title.toLowerCase().includes(searchLower) ||
            todo.description.toLowerCase().includes(searchLower)
        )
    }

    // Filter by status
    if (status) {
        result = result.filter(todo => todo.status === status)
    }

    // Filter by priority
    if (priority) {
        result = result.filter(todo => todo.priority === priority)
    }

    // Group by if requested
    if (groupBy && (groupBy === "status" || groupBy === "priority")) {
        const grouped = result.reduce((acc, todo) => {
            const key = todo[groupBy]
            if (!acc[key]) {
                acc[key] = []
            }
            acc[key].push(todo)
            return acc
        }, {} as Record<string, TodoI[]>)

        return c.json({
            grouped,
            meta: {
                groupBy,
                total: result.length,
                groups: Object.keys(grouped).length
            }
        })
    }

    // Sort
    result = [...result].sort((a, b) => {
        const aVal = a[sortBy as keyof TodoI]
        const bVal = b[sortBy as keyof TodoI]

        if (sortOrder === "desc") {
            return bVal.localeCompare(aVal)
        }
        return aVal.localeCompare(bVal)
    })

    // Pagination
    const total = result.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedData = result.slice(start, end)

    return c.json({
        data: paginatedData,
        meta: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    })
})

todos.get('/:id', async (c) => {
    const todoId = c.req.param('id')
    const todo = testDB.find(todo => todo.id === todoId)

    if (!todo) {
        return c.json({ error: "Not found" }, 404)
    }

    return c.json({ todo })
})

todos.get('/stats/aggregate', (c) => {
    const totalTodos = testDB.length

    // Group by status
    const byStatus = testDB.reduce((acc, todo) => {
        acc[todo.status] = (acc[todo.status] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    // Group by priority
    const byPriority = testDB.reduce((acc, todo) => {
        acc[todo.priority] = (acc[todo.priority] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    // Average title and description lengths
    const avgTitleLength = testDB.length > 0
        ? testDB.reduce((sum, todo) => sum + todo.title.length, 0) / testDB.length
        : 0

    const avgDescLength = testDB.length > 0
        ? testDB.reduce((sum, todo) => sum + todo.description.length, 0) / testDB.length
        : 0

    // Completion rate
    const completedCount = byStatus.completed || 0
    const completionRate = totalTodos > 0
        ? ((completedCount / totalTodos) * 100).toFixed(2)
        : "0.00"

    return c.json({
        stats: {
            total: totalTodos,
            byStatus,
            byPriority,
            averages: {
                titleLength: avgTitleLength.toFixed(2),
                descriptionLength: avgDescLength.toFixed(2)
            },
            completionRate: `${completionRate}%`
        }
    })
})

todos.post('/', async (c) => {
    const body = await c.req.json()
    const { title, description, status, priority } = body

    if (!title || !description) {
        return c.json({ error: "Title and description are required" }, 400)
    }

    const id = Math.random().toString(36).substring(2, 11)

    const newTodo: TodoI = {
        id,
        title,
        description,
        status: status || "pending",
        priority: priority || "medium"
    }

    testDB.push(newTodo)
    return c.json({ success: true, todo: newTodo }, 201)
})


todos.put('/:id', async (c) => {
    const todoId = c.req.param('id')
    const body = await c.req.json()
    const { title, description, status, priority } = body

    if (!title || !description) {
        return c.json({ error: "Title and description are required" }, 400)
    }

    const todoIndex = testDB.findIndex(todo => todo.id === todoId)

    if (todoIndex === -1) {
        return c.json({ error: "Not Found" }, 404)
    }

    const updatedTodo: TodoI = {
        id: todoId,
        title,
        description,
        status: status || "pending",
        priority: priority || "medium"
    }

    testDB[todoIndex] = updatedTodo

    return c.json({ success: true, todo: updatedTodo })
})

todos.patch('/:id', async (c) => {
    const todoId = c.req.param('id')
    const body = await c.req.json()
    const { title, description, status, priority } = body

    const todoIndex = testDB.findIndex(todo => todo.id === todoId)

    if (todoIndex === -1) {
        return c.json({ error: "Not Found" }, 404)
    }

    const existingTodo = testDB[todoIndex]

    // Only update fields that are provided (nullish coalescing)
    const updatedTodo: TodoI = {
        id: todoId, // Never allow ID changes
        title: title ?? existingTodo.title,
        description: description ?? existingTodo.description,
        status: status ?? existingTodo.status,
        priority: priority ?? existingTodo.priority
    }

    testDB[todoIndex] = updatedTodo

    return c.json({ success: true, todo: updatedTodo })
})

// Mock third-party API endpoint using Promise.all
todos.get('/external/user-data/:userId', async (c) => {
    const userId = Number(c.req.param('userId'))

    if (isNaN(userId)) {
        return c.json({ error: "Invalid user ID" }, 400)
    }

    const startTime = Date.now()

    try {
        // Fetch multiple resources in parallel using Promise.all
        const [user, posts, userDetails] = await Promise.all([
            mockApi.getUser(userId),
            mockApi.getUserPosts(userId),
            mockApi.getUser(userId) // Simulate getting additional user details
        ])

        // Fetch comments for the first post if posts exist
        let comments = []
        if (posts.length > 0) {
            comments = await mockApi.getComments(posts[0].id)
        }

        const endTime = Date.now()
        const duration = endTime - startTime

        return c.json({
            success: true,
            data: {
                user,
                posts,
                firstPostComments: comments
            },
            meta: {
                fetchTime: `${duration}ms`,
                parallelRequests: 3,
                sequentialRequests: comments.length > 0 ? 1 : 0
            }
        })
    } catch (error) {
        return c.json({
            error: "Failed to fetch external data",
            message: error instanceof Error ? error.message : "Unknown error"
        }, 500)
    }
})

// Advanced Promise.all example with multiple API calls
todos.get('/external/batch/:count', async (c) => {
    const count = Number(c.req.param('count')) || 5

    if (count > 20) {
        return c.json({ error: "Maximum 20 requests allowed" }, 400)
    }

    const startTime = Date.now()

    try {
        // Create array of promises for multiple users
        const userPromises = Array.from({ length: count }, (_, i) =>
            mockApi.getUser(i + 1)
        )

        // Fetch all users in parallel
        const users = await Promise.all(userPromises)

        // Now fetch posts for all users in parallel
        const postsPromises = users.map(user =>
            mockApi.getUserPosts(user.id)
        )

        const allPosts = await Promise.all(postsPromises)

        const endTime = Date.now()
        const duration = endTime - startTime

        return c.json({
            success: true,
            data: {
                users,
                postsCount: allPosts.flat().length,
                postsByUser: allPosts.map((posts, idx) => ({
                    userId: users[idx].id,
                    postCount: posts.length
                }))
            },
            meta: {
                totalRequests: count * 2, // users + posts
                fetchTime: `${duration}ms`,
                efficiency: "Using Promise.all for parallel execution"
            }
        })
    } catch (error) {
        return c.json({
            error: "Failed to fetch batch data",
            message: error instanceof Error ? error.message : "Unknown error"
        }, 500)
    }
})

export default todos