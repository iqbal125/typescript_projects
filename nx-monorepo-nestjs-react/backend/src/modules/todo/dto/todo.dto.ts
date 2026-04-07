import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { CreateTodoSchema, UpdateTodoSchema } from '@org/shared-types';

export class UpdateTodoDto extends createZodDto(UpdateTodoSchema) { }

export class CreateTodoDto extends createZodDto(CreateTodoSchema) { }

export class UuidParamDto extends createZodDto(z.object({ id: z.string().uuid() })) { }

export type TodoId = UuidParamDto['id'];
