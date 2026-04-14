import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import AppRoutes from './providers/routes';
import { DashboardLayout } from './components/DashboardLayout';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <DashboardLayout>
            <AppRoutes />
          </DashboardLayout>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
