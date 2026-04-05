import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Trash2, X, Check } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateTodo, deleteTodo } from '@/api/todoApi';
import { updateTodoSchema } from '@/types/validations';
import type { UpdateTodoInput } from '@/types/validations';
import type { Todo } from '@/types/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

export const TodoCard: React.FC<{ todo: Todo }> = ({ todo }) => {
    const queryClient = useQueryClient();
    const [editing, setEditing] = useState(false);

    const form = useForm<UpdateTodoInput>({
        resolver: zodResolver(updateTodoSchema),
        defaultValues: { title: todo.title, description: todo.description ?? '' },
    });

    const updateMutation = useMutation({
        mutationFn: (values: UpdateTodoInput) => updateTodo(todo.id, values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            setEditing(false);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteTodo(todo.id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    });

    const onSubmit = (values: UpdateTodoInput) => updateMutation.mutate(values);
    const handleDelete = () => deleteMutation.mutate();

    if (editing) {
        return (
            <Card className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-2">
                            <Button type="submit" size="sm" disabled={updateMutation.isPending}>
                                <Check />
                                Save
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => setEditing(false)}
                            >
                                <X />
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <CardHeader className="p-0">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <CardTitle>{todo.title}</CardTitle>
                        {todo.description && (
                            <CardDescription>{todo.description}</CardDescription>
                        )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setEditing(true)}
                            aria-label="Edit todo"
                        >
                            <Pencil />
                        </Button>
                        <Button
                            size="icon"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            aria-label="Delete todo"
                        >
                            <Trash2 />
                        </Button>
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
};
