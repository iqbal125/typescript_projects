import { createZodDto } from 'nestjs-zod';
import { CreateTodoSchema } from '@org/shared-types';

export class CreateTodoDto extends createZodDto(CreateTodoSchema) { }
