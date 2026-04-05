import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TodoRepository } from './todo.repository';

@Module({
  imports: [],
  controllers: [TodoController],
  providers: [TodoService, TodoRepository],
})
export class TodoModule { }
