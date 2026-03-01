import { RouterProvider } from 'react-router';
import { router } from './routes';
import { PortfolioProvider } from './contexts/PortfolioContext';
import { ThemeWrapper } from './components/ThemeWrapper';
import { AuthProvider } from './contexts/AuthContext';
import { AppErrorBoundary } from './components/AppErrorBoundary';

export default function App() {
  return (
    <PortfolioProvider>
      <AuthProvider>
        <ThemeWrapper>
          <AppErrorBoundary>
            <RouterProvider router={router} />
          </AppErrorBoundary>
        </ThemeWrapper>
      </AuthProvider>
    </PortfolioProvider>
  );
}
