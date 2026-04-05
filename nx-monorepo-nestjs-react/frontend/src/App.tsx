import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from './providers/routes';
import Header from './components/Header';

const queryClient = new QueryClient();


const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Router>
          <div className="max-w-screen-2xl mx-auto py-8 px-4">
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
              <Header />
              <div className="p-6">
                <AppRoutes />
              </div>
            </div>
          </div>
        </Router>
      </div>
    </QueryClientProvider>
  );
};

export default App;
