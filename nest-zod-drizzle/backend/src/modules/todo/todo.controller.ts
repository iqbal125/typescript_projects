import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/request/create-todo.dto';
import { UpdateTodoDto } from './dto/request/update-todo.dto';
import { TodoService } from './todo.service';
import { Todo } from './dto/response/todo.types';


@Controller()
export class TodoController {
  constructor(private readonly TodoService: TodoService) { }

  @Get('todo/:id')
  async getTodoById(@Param('id', ParseIntPipe) id: number): Promise<Todo> {
    return this.TodoService.getOneTodo(id);
  }

  @Get('todos')
  async getTodos(): Promise<Todo[]> {
    return this.TodoService.getTodos();
  }

  @Post('todo')
  async createTodo(@Body() TodoData: CreateTodoDto): Promise<Todo> {
    return this.TodoService.createTodo(TodoData);
  }

  @Put('todo/:id')
  async updateTodo(
    @Param('id', ParseIntPipe) id: number,
    @Body() TodoData: UpdateTodoDto,
  ): Promise<Todo> {
    return this.TodoService.updateTodo(id, TodoData);
  }

  @Delete('todo/:id')
  async deleteTodo(@Param('id', ParseIntPipe) id: number): Promise<Todo> {
    return this.TodoService.deleteTodo(id);
  }

  @Post('/todo/seed')
  @HttpCode(200)
  async seedTodos(): Promise<Todo[]> {
    return this.TodoService.seedTodos();
  }
}
