import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { getTodos } from '@/api/todoApi';

import { CreateTodoForm } from './CreateTodoForm';
import { TodoCard } from './TodoCard';

// ── Page ─────────────────────────────────────────────────────────────────────

const TodosPage: React.FC = () => {
    const { data: todos = [], isLoading, isError } = useQuery({
        queryKey: ['todos'],
        queryFn: getTodos,
    });

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Todos</h1>

            <CreateTodoForm />

            {isLoading && <p className="text-muted-foreground text-sm">Loading...</p>}
            {isError && <p className="text-destructive text-sm">Failed to load todos.</p>}

            {!isLoading && !isError && todos.length === 0 && (
                <p className="text-muted-foreground text-sm">No todos yet. Create one above.</p>
            )}

            <div className="space-y-3">
                {todos.map((todo) => (
                    <TodoCard key={todo.id} todo={todo} />
                ))}
            </div>
        </div>
    );
};

export default TodosPage;
