import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createTodo } from '@/api/todoApi';
import { CreateTodoSchema, type CreateTodoInput } from '@org/shared-types/todo/requests';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

export const CreateTodoForm: React.FC = () => {
    const queryClient = useQueryClient();

    const form = useForm<CreateTodoInput>({
        resolver: zodResolver(CreateTodoSchema),
        defaultValues: { title: '', description: '' },
    });

    const mutation = useMutation({
        mutationFn: createTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            form.reset();
        },
    });

    const onSubmit = (values: CreateTodoInput) => mutation.mutate(values);

    return (
        <Card className="p-6">
            <CardHeader className="p-0 mb-4">
                <CardTitle>New Todo</CardTitle>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Todo title..." {...field} />
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
                                    <Input placeholder="Optional description..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={mutation.isPending}>
                        <Plus />
                        Add Todo
                    </Button>
                </form>
            </Form>
        </Card>
    );
};
