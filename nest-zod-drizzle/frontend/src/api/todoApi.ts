import axiosBase from './axiosBase';
import type { Todo } from '@/types/types';
import type { CreateTodoInput, UpdateTodoInput } from '@/types/validations';

export const getTodos = async (): Promise<Todo[]> => {
    const { data } = await axiosBase.get<Todo[]>('/todos');
    return data;
};

export const getTodoById = async (id: number): Promise<Todo> => {
    const { data } = await axiosBase.get<Todo>(`/todo/${id}`);
    return data;
};

export const createTodo = async (payload: CreateTodoInput): Promise<Todo> => {
    const { data } = await axiosBase.post<Todo>('/todo', payload);
    return data;
};

export const updateTodo = async (id: number, payload: UpdateTodoInput): Promise<Todo> => {
    const { data } = await axiosBase.put<Todo>(`/todo/${id}`, payload);
    return data;
};

export const deleteTodo = async (id: number): Promise<Todo> => {
    const { data } = await axiosBase.delete<Todo>(`/todo/${id}`);
    return data;
};
