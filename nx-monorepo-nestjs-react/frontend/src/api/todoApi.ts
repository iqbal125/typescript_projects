import axiosBase from './axiosBase';
import type { PaginatedTodos, Todo } from '@/types/types';
import type { CreateTodoInput, UpdateTodoInput } from '@/types/validations';

export const getTodos = async (limit: number, offset: number): Promise<PaginatedTodos> => {
    const { data } = await axiosBase.get<PaginatedTodos>('/v1/todos', { params: { limit, offset } });
    return data;
};

export const getTodoById = async (id: number): Promise<Todo> => {
    const { data } = await axiosBase.get<Todo>(`/v1/todo/${id}`);
    return data;
};

export const createTodo = async (payload: CreateTodoInput): Promise<Todo> => {
    const { data } = await axiosBase.post<Todo>('/v1/todo', payload);
    return data;
};

export const updateTodo = async (id: number, payload: UpdateTodoInput): Promise<Todo> => {
    const { data } = await axiosBase.put<Todo>(`/v1/todo/${id}`, payload);
    return data;
};

export const deleteTodo = async (id: number): Promise<Todo> => {
    const { data } = await axiosBase.delete<Todo>(`/v1/todo/${id}`);
    return data;
};
