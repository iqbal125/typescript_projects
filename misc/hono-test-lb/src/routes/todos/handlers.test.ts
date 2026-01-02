import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Hono } from 'hono'
import todos, { testDB } from './handlers'

// Helper function to make requests
const makeRequest = async (app: Hono, method: string, path: string, body?: any) => {
    const req = new Request(`http://localhost${path}`, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : {},
        body: body ? JSON.stringify(body) : undefined,
    })
    return await app.fetch(req)
}

describe('Todo Handlers', () => {
    beforeEach(() => {
        // Clear the test database before each test
        testDB.length = 0
    })

    describe('POST /', () => {
        it('should create a new todo with required fields', async () => {
            const todoData = {
                title: 'Test Todo',
                description: 'Test Description'
            }

            const res = await makeRequest(todos, 'POST', '/', todoData)
            const data = await res.json()

            expect(res.status).toBe(201)
            expect(data.success).toBe(true)
            expect(data.todo).toMatchObject({
                title: 'Test Todo',
                description: 'Test Description',
                status: 'pending',
                priority: 'medium'
            })
            expect(data.todo.id).toBeDefined()
            expect(testDB.length).toBe(1)
        })

        it('should create a todo with custom status and priority', async () => {
            const todoData = {
                title: 'Important Task',
                description: 'High priority task',
                status: 'in-progress',
                priority: 'high'
            }

            const res = await makeRequest(todos, 'POST', '/', todoData)
            const data = await res.json()

            expect(res.status).toBe(201)
            expect(data.todo.status).toBe('in-progress')
            expect(data.todo.priority).toBe('high')
        })

        it('should return 400 if title is missing', async () => {
            const todoData = {
                description: 'Test Description'
            }

            const res = await makeRequest(todos, 'POST', '/', todoData)
            const data = await res.json()

            expect(res.status).toBe(400)
            expect(data.error).toBe('Title and description are required')
        })

        it('should return 400 if description is missing', async () => {
            const todoData = {
                title: 'Test Todo'
            }

            const res = await makeRequest(todos, 'POST', '/', todoData)
            const data = await res.json()

            expect(res.status).toBe(400)
            expect(data.error).toBe('Title and description are required')
        })
    })

    describe('GET /:id', () => {
        it('should get a todo by id', async () => {
            testDB.push({
                id: 'test-id-123',
                title: 'Test Todo',
                description: 'Test Description',
                status: 'pending',
                priority: 'medium'
            })

            const res = await makeRequest(todos, 'GET', '/test-id-123')
            const data = await res.json()

            expect(res.status).toBe(200)
            expect(data.todo).toMatchObject({
                id: 'test-id-123',
                title: 'Test Todo',
                description: 'Test Description'
            })
        })

        it('should return 404 if todo not found', async () => {
            const res = await makeRequest(todos, 'GET', '/nonexistent-id')
            const data = await res.json()

            expect(res.status).toBe(404)
            expect(data.error).toBe('Not found')
        })
    })

    describe('GET /', () => {
        beforeEach(() => {
            // Add sample todos
            testDB.push(
                {
                    id: '1',
                    title: 'First Todo',
                    description: 'First description',
                    status: 'pending',
                    priority: 'low'
                },
                {
                    id: '2',
                    title: 'Second Todo',
                    description: 'Second description',
                    status: 'completed',
                    priority: 'high'
                },
                {
                    id: '3',
                    title: 'Third Todo',
                    description: 'Third description',
                    status: 'in-progress',
                    priority: 'medium'
                }
            )
        })

        it('should return all todos with pagination', async () => {
            const res = await makeRequest(todos, 'GET', '/?page=1&limit=10')
            const data = await res.json()

            expect(res.status).toBe(200)
            expect(data.data).toHaveLength(3)
            expect(data.meta).toMatchObject({
                page: 1,
                limit: 10,
                total: 3,
                totalPages: 1,
                hasNext: false,
                hasPrev: false
            })
        })

        it('should filter todos by search query', async () => {
            const res = await makeRequest(todos, 'GET', '/?search=first')
            const data = await res.json()

            expect(data.data).toHaveLength(1)
            expect(data.data[0].title).toBe('First Todo')
        })

        it('should filter todos by status', async () => {
            const res = await makeRequest(todos, 'GET', '/?status=completed')
            const data = await res.json()

            expect(data.data).toHaveLength(1)
            expect(data.data[0].status).toBe('completed')
        })

        it('should filter todos by priority', async () => {
            const res = await makeRequest(todos, 'GET', '/?priority=high')
            const data = await res.json()

            expect(data.data).toHaveLength(1)
            expect(data.data[0].priority).toBe('high')
        })

        it('should group todos by status', async () => {
            const res = await makeRequest(todos, 'GET', '/?groupBy=status')
            const data = await res.json()

            expect(data.grouped).toBeDefined()
            expect(data.grouped.pending).toHaveLength(1)
            expect(data.grouped.completed).toHaveLength(1)
            expect(data.grouped['in-progress']).toHaveLength(1)
            expect(data.meta.groups).toBe(3)
        })

        it('should group todos by priority', async () => {
            const res = await makeRequest(todos, 'GET', '/?groupBy=priority')
            const data = await res.json()

            expect(data.grouped).toBeDefined()
            expect(data.grouped.low).toHaveLength(1)
            expect(data.grouped.medium).toHaveLength(1)
            expect(data.grouped.high).toHaveLength(1)
        })

        it('should sort todos in ascending order', async () => {
            const res = await makeRequest(todos, 'GET', '/?sortBy=title&sortOrder=asc')
            const data = await res.json()

            expect(data.data[0].title).toBe('First Todo')
            expect(data.data[1].title).toBe('Second Todo')
            expect(data.data[2].title).toBe('Third Todo')
        })

        it('should sort todos in descending order', async () => {
            const res = await makeRequest(todos, 'GET', '/?sortBy=title&sortOrder=desc')
            const data = await res.json()

            expect(data.data[0].title).toBe('Third Todo')
            expect(data.data[1].title).toBe('Second Todo')
            expect(data.data[2].title).toBe('First Todo')
        })

        it('should paginate results correctly', async () => {
            const res = await makeRequest(todos, 'GET', '/?page=2&limit=2')
            const data = await res.json()

            expect(data.data).toHaveLength(1)
            expect(data.meta.page).toBe(2)
            expect(data.meta.totalPages).toBe(2)
            expect(data.meta.hasNext).toBe(false)
            expect(data.meta.hasPrev).toBe(true)
        })
    })

    describe('PUT /:id', () => {
        beforeEach(() => {
            testDB.push({
                id: 'update-test',
                title: 'Original Title',
                description: 'Original Description',
                status: 'pending',
                priority: 'low'
            })
        })

        it('should update a todo completely', async () => {
            const updateData = {
                title: 'Updated Title',
                description: 'Updated Description',
                status: 'completed',
                priority: 'high'
            }

            const res = await makeRequest(todos, 'PUT', '/update-test', updateData)
            const data = await res.json()

            expect(res.status).toBe(200)
            expect(data.success).toBe(true)
            expect(data.todo).toMatchObject({
                id: 'update-test',
                title: 'Updated Title',
                description: 'Updated Description',
                status: 'completed',
                priority: 'high'
            })
        })

        it('should return 404 if todo not found', async () => {
            const updateData = {
                title: 'Updated Title',
                description: 'Updated Description'
            }

            const res = await makeRequest(todos, 'PUT', '/nonexistent', updateData)
            const data = await res.json()

            expect(res.status).toBe(404)
            expect(data.error).toBe('Not Found')
        })

        it('should return 400 if required fields are missing', async () => {
            const updateData = {
                title: 'Updated Title'
            }

            const res = await makeRequest(todos, 'PUT', '/update-test', updateData)
            const data = await res.json()

            expect(res.status).toBe(400)
            expect(data.error).toBe('Title and description are required')
        })
    })

    describe('PATCH /:id', () => {
        beforeEach(() => {
            testDB.push({
                id: 'patch-test',
                title: 'Original Title',
                description: 'Original Description',
                status: 'pending',
                priority: 'low'
            })
        })

        it('should partially update a todo', async () => {
            const patchData = {
                title: 'Patched Title'
            }

            const res = await makeRequest(todos, 'PATCH', '/patch-test', patchData)
            const data = await res.json()

            expect(res.status).toBe(200)
            expect(data.todo).toMatchObject({
                id: 'patch-test',
                title: 'Patched Title',
                description: 'Original Description',
                status: 'pending',
                priority: 'low'
            })
        })

        it('should update only status', async () => {
            const patchData = {
                status: 'completed'
            }

            const res = await makeRequest(todos, 'PATCH', '/patch-test', patchData)
            const data = await res.json()

            expect(data.todo.status).toBe('completed')
            expect(data.todo.title).toBe('Original Title')
        })

        it('should return 404 if todo not found', async () => {
            const patchData = {
                title: 'Patched Title'
            }

            const res = await makeRequest(todos, 'PATCH', '/nonexistent', patchData)
            const data = await res.json()

            expect(res.status).toBe(404)
            expect(data.error).toBe('Not Found')
        })
    })

    describe('GET /stats/aggregate', () => {
        beforeEach(() => {
            testDB.push(
                {
                    id: '1',
                    title: 'Short',
                    description: 'Brief',
                    status: 'pending',
                    priority: 'low'
                },
                {
                    id: '2',
                    title: 'Medium length title',
                    description: 'Medium length description here',
                    status: 'completed',
                    priority: 'high'
                },
                {
                    id: '3',
                    title: 'Another',
                    description: 'Text',
                    status: 'completed',
                    priority: 'medium'
                }
            )
        })

        it('should return aggregated statistics', async () => {
            const res = await makeRequest(todos, 'GET', '/stats/aggregate')
            const data = await res.json()

            expect(res.status).toBe(200)
            expect(data.stats).toMatchObject({
                total: 3,
                byStatus: {
                    pending: 1,
                    completed: 2
                },
                byPriority: {
                    low: 1,
                    medium: 1,
                    high: 1
                }
            })
            expect(data.stats.averages).toBeDefined()
            expect(data.stats.completionRate).toBe('66.67%')
        })

        it('should handle empty database', async () => {
            testDB.length = 0
            const res = await makeRequest(todos, 'GET', '/stats/aggregate')
            const data = await res.json()

            expect(data.stats.total).toBe(0)
            expect(data.stats.completionRate).toBe('0.00%')
        })
    })

    describe('GET /external/user-data/:userId', () => {
        it('should fetch user data with parallel requests', async () => {
            const res = await makeRequest(todos, 'GET', '/external/user-data/1')
            const data = await res.json()

            expect(res.status).toBe(200)
            expect(data.success).toBe(true)
            expect(data.data.user).toMatchObject({
                id: 1,
                name: 'User 1',
                email: 'user1@example.com'
            })
            expect(data.data.posts).toHaveLength(5)
            expect(data.data.firstPostComments).toHaveLength(3)
            expect(data.meta.parallelRequests).toBe(3)
            expect(data.meta.fetchTime).toMatch(/\d+ms/)
        })

        it('should return 400 for invalid user ID', async () => {
            const res = await makeRequest(todos, 'GET', '/external/user-data/invalid')
            const data = await res.json()

            expect(res.status).toBe(400)
            expect(data.error).toBe('Invalid user ID')
        })
    })

    describe('GET /external/batch/:count', () => {
        it('should fetch batch data for multiple users', async () => {
            const res = await makeRequest(todos, 'GET', '/external/batch/3')
            const data = await res.json()

            expect(res.status).toBe(200)
            expect(data.success).toBe(true)
            expect(data.data.users).toHaveLength(3)
            expect(data.data.postsByUser).toHaveLength(3)
            expect(data.meta.totalRequests).toBe(6)
            expect(data.meta.fetchTime).toMatch(/\d+ms/)
        })

        it('should return 400 if count exceeds maximum', async () => {
            const res = await makeRequest(todos, 'GET', '/external/batch/25')
            const data = await res.json()

            expect(res.status).toBe(400)
            expect(data.error).toBe('Maximum 20 requests allowed')
        })

        it('should use default count if not provided', async () => {
            const res = await makeRequest(todos, 'GET', '/external/batch/invalid')
            const data = await res.json()

            expect(res.status).toBe(200)
            expect(data.data.users).toHaveLength(5)
        })
    })
})
