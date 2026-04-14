import { Injectable, NotFoundException } from '@nestjs/common';
import type { TodoDto, PaginatedTodosDto, DeleteTodoDto } from '@org/shared-types/todo/responses';
import { UpdateTodoDto, CreateTodoDto } from './dto/todo.dto';
import { TodoRepository } from './todo.repository';


@Injectable()
export class TodoService {
  constructor(private todoRepository: TodoRepository) { }

  async getOneTodo(id: string): Promise<TodoDto> {
    const result = await this.todoRepository.findById(id);
    if (!result) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return result;
  }

  async getTodos(limit: number, offset: number): Promise<PaginatedTodosDto> {
    const [data, total] = await Promise.all([
      this.todoRepository.findMany(limit, offset),
      this.todoRepository.countAll(),
    ]);

    return {
      data,
      meta: {
        total,
        limit,
        offset,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createTodo(data: CreateTodoDto): Promise<TodoDto> {
    return this.todoRepository.create(data);
  }

  async updateTodo(id: string, data: UpdateTodoDto): Promise<TodoDto> {
    const result = await this.todoRepository.update(id, data);
    if (!result) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return result;
  }

  async deleteTodo(id: string): Promise<DeleteTodoDto> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    await this.todoRepository.delete(id);
    return { success: true };
  }

  async seedTodos(): Promise<TodoDto[]> {
    return this.todoRepository.seed();
  }
}
