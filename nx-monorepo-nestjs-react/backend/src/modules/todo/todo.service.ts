import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedTodos, Todo } from './dto/response/todo.types';
import { CreateTodoDto } from './dto/request/create-todo.dto';
import { UpdateTodoDto } from './dto/request/update-todo.dto';
import { TodoRepository } from './todo.repository';


@Injectable()
export class TodoService {
  constructor(private todoRepository: TodoRepository) { }

  async getOneTodo(id: number): Promise<Todo> {
    const result = await this.todoRepository.findById(id);
    if (!result) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return result;
  }

  async getTodos(limit: number, offset: number): Promise<PaginatedTodos> {
    return this.todoRepository.findAll(limit, offset);
  }

  async createTodo(data: CreateTodoDto): Promise<Todo> {
    return this.todoRepository.create(data);
  }

  async updateTodo(id: number, data: UpdateTodoDto): Promise<Todo> {
    const result = await this.todoRepository.update(id, data);
    if (!result) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return result;
  }

  async deleteTodo(id: number): Promise<Todo> {
    const result = await this.todoRepository.delete(id);
    if (!result) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return result;
  }

  async seedTodos(): Promise<Todo[]> {
    return this.todoRepository.seed();
  }
}
