import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

import { ErrorBoundary } from "./ErrorBoundary";

interface RouteAwareErrorBoundaryProps {
  children: ReactNode;
}

function RouteAwareErrorBoundary({ children }: RouteAwareErrorBoundaryProps) {
  const location = useLocation();

  return <ErrorBoundary key={location.pathname}>{children}</ErrorBoundary>;
}

export default RouteAwareErrorBoundary;
