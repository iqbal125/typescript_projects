import { createZodDto } from 'nestjs-zod';
import { UpdateTodoSchema } from '@org/shared-types';

export class UpdateTodoDto extends createZodDto(UpdateTodoSchema) { }
