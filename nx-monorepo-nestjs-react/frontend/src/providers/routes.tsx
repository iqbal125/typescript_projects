import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import TodosPage from '../pages/CreateTodos';
import TodosTablePage from '../pages/TodosTable';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/todos" element={<TodosPage />} />
            <Route path="/todos-table" element={<TodosTablePage />} />
        </Routes>
    );
};

export default AppRoutes;
