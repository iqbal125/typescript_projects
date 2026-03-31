import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from '../../database/drizzle.service';
import { Todo } from './dto/create-todo.dto'
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { todos } from 'src/database/schema';

@Injectable()
export class TodoService {
  constructor(private drizzle: DrizzleService) { }

  async getOneTodo(id: number): Promise<Todo> {
    const result = await this.drizzle.db
      .select()
      .from(todos)
      .where(eq(todos.id, id))
      .limit(1);
    if (!result[0]) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return result[0];
  }

  async getTodos(): Promise<Todo[]> {
    return this.drizzle.db.select().from(todos);
  }

  async createTodo(data: CreateTodoDto): Promise<Todo> {
    const result = await this.drizzle.db.insert(todos).values(data).returning();
    return result[0];
  }

  async updateTodo(id: number, data: UpdateTodoDto): Promise<Todo> {
    const result = await this.drizzle.db
      .update(todos)
      .set(data)
      .where(eq(todos.id, id))
      .returning();
    if (!result[0]) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return result[0];
  }

  async deleteTodo(id: number): Promise<Todo> {
    const result = await this.drizzle.db
      .delete(todos)
      .where(eq(todos.id, id))
      .returning();
    if (!result[0]) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return result[0];
  }
}
