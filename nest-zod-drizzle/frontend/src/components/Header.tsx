import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="bg-white border-b border-gray-200 mb-6">
            <nav className="flex space-x-6 px-6 py-4">
                <Link
                    to="/"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                    Home
                </Link>
                <Link
                    to="/todos"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                    Todos
                </Link>
                <Link
                    to="/todos-table"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                    Todos Table
                </Link>
            </nav>
        </header>
    );
};

export default Header;
