import axiosBase from './axiosBase';
import type { PaginatedTodosDto, TodoDto, CreateTodoInput, UpdateTodoInput } from '@org/shared-types';

export const getTodos = async (limit: number, offset: number): Promise<PaginatedTodosDto> => {
    const { data } = await axiosBase.get<PaginatedTodosDto>('/v1/todos', { params: { limit, offset } });
    return data;
};

export const getTodoById = async (id: number): Promise<TodoDto> => {
    const { data } = await axiosBase.get<TodoDto>(`/v1/todo/${id}`);
    return data;
};

export const createTodo = async (payload: CreateTodoInput): Promise<TodoDto> => {
    const { data } = await axiosBase.post<TodoDto>('/v1/todo', payload);
    return data;
};

export const updateTodo = async (id: number, payload: UpdateTodoInput): Promise<TodoDto> => {
    const { data } = await axiosBase.put<TodoDto>(`/v1/todo/${id}`, payload);
    return data;
};

export const deleteTodo = async (id: number): Promise<TodoDto> => {
    const { data } = await axiosBase.delete<TodoDto>(`/v1/todo/${id}`);
    return data;
};
