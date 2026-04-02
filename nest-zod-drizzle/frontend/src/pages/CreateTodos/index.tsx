import React from 'react';

import { CreateTodoForm } from './CreateTodoForm';

// ── Page ─────────────────────────────────────────────────────────────────────

const TodosPage: React.FC = () => {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Create Todo</h1>
            <CreateTodoForm />
        </div>
    );
};

export default TodosPage;
