import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateTodoSchema = z.object({
    title: z.string().min(3),
    description: z.string().max(300).optional(),
});

export class CreateTodoDto extends createZodDto(CreateTodoSchema) { }
