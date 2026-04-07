import { Injectable, NotFoundException } from '@nestjs/common';
import type { TodoDto, PaginatedTodosDto } from '@org/shared-types';
import { CreateTodoDto } from './dto/request/create-todo.dto';
import { UpdateTodoDto } from './dto/request/update-todo.dto';
import { TodoRepository } from './todo.repository';


@Injectable()
export class TodoService {
  constructor(private todoRepository: TodoRepository) { }

  async getOneTodo(id: number): Promise<TodoDto> {
    const result = await this.todoRepository.findById(id);
    if (!result) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return result;
  }

  async getTodos(limit: number, offset: number): Promise<PaginatedTodosDto> {
    return this.todoRepository.findAll(limit, offset);
  }

  async createTodo(data: CreateTodoDto): Promise<TodoDto> {
    return this.todoRepository.create(data);
  }

  async updateTodo(id: number, data: UpdateTodoDto): Promise<TodoDto> {
    const result = await this.todoRepository.update(id, data);
    if (!result) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return result;
  }

  async deleteTodo(id: number): Promise<TodoDto> {
    const result = await this.todoRepository.delete(id);
    if (!result) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return result;
  }

  async seedTodos(): Promise<TodoDto[]> {
    return this.todoRepository.seed();
  }
}
