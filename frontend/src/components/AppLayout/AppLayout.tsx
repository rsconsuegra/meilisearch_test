import { Outlet } from "react-router-dom";

import RouteAwareErrorBoundary from "../ErrorBoundary/RouteAwareErrorBoundary";
import Header from "../Header/Header";
import Layout from "../Layout/Layout";

function AppLayout() {
  return (
    <RouteAwareErrorBoundary>
      <Header />
      <Layout>
        <Outlet />
      </Layout>
    </RouteAwareErrorBoundary>
  );
}

export default AppLayout;
