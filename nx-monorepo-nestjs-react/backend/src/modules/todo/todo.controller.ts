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
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { UpdateTodoDto, CreateTodoDto, UuidParamDto } from './dto/todo.dto';
import { TodoService } from './todo.service';
import type { PaginatedTodosDto, TodoDto, DeleteTodoDto } from '@org/shared-types';


@Controller()
export class TodoController {
  constructor(private readonly TodoService: TodoService) { }

  @Get('todo/:id')
  async getTodoById(@Param() { id }: UuidParamDto): Promise<TodoDto> {
    return this.TodoService.getOneTodo(id);
  }

  @Get('todos')
  async getTodos(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<PaginatedTodosDto> {
    return this.TodoService.getTodos(limit, offset);
  }

  @Post('todo')
  async createTodo(@Body() TodoData: CreateTodoDto): Promise<TodoDto> {
    console.log("RRRRRRRR")
    return this.TodoService.createTodo(TodoData);
  }

  @Put('todo/:id')
  async updateTodo(
    @Param() { id }: UuidParamDto,
    @Body() TodoData: UpdateTodoDto,
  ): Promise<TodoDto> {
    return this.TodoService.updateTodo(id, TodoData);
  }

  @Delete('todo/:id')
  async deleteTodo(@Param() { id }: UuidParamDto): Promise<DeleteTodoDto> {
    return this.TodoService.deleteTodo(id);
  }

  @Post('/todo/seed')
  @HttpCode(200)
  async seedTodos(): Promise<TodoDto[]> {
    return this.TodoService.seedTodos();
  }
}
