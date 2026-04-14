import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  UpdateTodoDto,
  CreateTodoDto,
  UuidParamDto,
  ListTodosQueryDto,
  TodoResponseDto,
  PaginatedTodosResponseDto,
  DeleteTodoResponseDto,
} from './dto/todo.dto';
import { TodoService } from './todo.service';
import type { PaginatedTodosDto, TodoDto, DeleteTodoDto } from '@org/shared-types/todo/responses';


@Controller()
export class TodoController {
  constructor(private readonly TodoService: TodoService) { }

  @Get('todo/:id')
  @ZodSerializerDto(TodoResponseDto)
  async getTodoById(@Param() { id }: UuidParamDto): Promise<TodoDto> {
    return this.TodoService.getOneTodo(id);
  }

  @Get('todos')
  @ZodSerializerDto(PaginatedTodosResponseDto)
  async getTodos(@Query() query: ListTodosQueryDto): Promise<PaginatedTodosDto> {
    return this.TodoService.getTodos(query.limit, query.offset);
  }

  @Post('todo')
  @ZodSerializerDto(TodoResponseDto)
  async createTodo(@Body() TodoData: CreateTodoDto): Promise<TodoDto> {
    return this.TodoService.createTodo(TodoData);
  }

  @Put('todo/:id')
  @ZodSerializerDto(TodoResponseDto)
  async updateTodo(
    @Param() { id }: UuidParamDto,
    @Body() TodoData: UpdateTodoDto,
  ): Promise<TodoDto> {
    return this.TodoService.updateTodo(id, TodoData);
  }

  @Delete('todo/:id')
  @ZodSerializerDto(DeleteTodoResponseDto)
  async deleteTodo(@Param() { id }: UuidParamDto): Promise<DeleteTodoDto> {
    return this.TodoService.deleteTodo(id);
  }

  @Post('/todo/seed')
  @HttpCode(200)
  async seedTodos(): Promise<TodoDto[]> {
    return this.TodoService.seedTodos();
  }
}
