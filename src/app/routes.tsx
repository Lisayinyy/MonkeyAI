import * as React from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { Root } from "./components/Root";
import { HomePage } from "./components/HomePage";
import { MarketPage } from "./components/MarketPage";
import { StockDetailPage } from "./components/StockDetailPage";
import { DailyAdvicePage } from "./components/DailyAdvicePage";
import { EventsPage } from "./components/EventsPage";
import { PortfolioPage } from "./components/PortfolioPage";
import { InsightsPage } from "./components/InsightsPage";
import { MonthlyReportPage } from "./components/MonthlyReportPage";
import { SettingsPage } from "./components/SettingsPage";
import { ProfilePage } from "./components/ProfilePage";
import { WelcomePage } from "./components/WelcomePage";
import { AuthPage } from "./components/AuthPage";
import { OnboardingPage } from "./components/OnboardingPage";
import { useAuth } from "./contexts/AuthContext";

function ErrorBoundary() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f23] flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Oops!</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Something went wrong.</p>
        <a href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
          Go back home
        </a>
      </div>
    </div>
  );
}

function RequireSignedOut() {
  const { isAuthenticated, onboardingCompleted } = useAuth();
  if (!isAuthenticated) return <Outlet />;
  return <Navigate to={onboardingCompleted ? "/" : "/onboarding"} replace />;
}

function RequireOnboarding() {
  const { isAuthenticated, onboardingCompleted } = useAuth();
  if (!isAuthenticated) return <Navigate to="/welcome" replace />;
  if (onboardingCompleted) return <Navigate to="/" replace />;
  return <Outlet />;
}

function RequireAppAccess({ children }: { children: React.ReactElement }) {
  const { isAuthenticated, onboardingCompleted } = useAuth();
  if (!isAuthenticated) return <Navigate to="/welcome" replace />;
  if (!onboardingCompleted) return <Navigate to="/onboarding" replace />;
  return children;
}

export const router = createBrowserRouter([
  {
    element: <RequireSignedOut />,
    children: [
      { path: "/welcome", element: <WelcomePage /> },
      { path: "/auth", element: <AuthPage /> },
    ],
  },
  {
    element: <RequireOnboarding />,
    children: [{ path: "/onboarding", element: <OnboardingPage /> }],
  },
  {
    path: "/",
    element: (
      <RequireAppAccess>
        <Root />
      </RequireAppAccess>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "market", element: <MarketPage /> },
      { path: "advice", element: <DailyAdvicePage /> },
      { path: "events", element: <EventsPage /> },
      { path: "portfolio", element: <PortfolioPage /> },
      { path: "insights", element: <InsightsPage /> },
      { path: "monthly-report", element: <MonthlyReportPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
  {
    path: "/market/stock/:symbol",
    element: (
      <RequireAppAccess>
        <StockDetailPage />
      </RequireAppAccess>
    ),
    errorElement: <ErrorBoundary />,
  },
]);
