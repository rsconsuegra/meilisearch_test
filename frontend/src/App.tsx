import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppLayout from "./components/AppLayout/AppLayout";
import PageLoader from "./components/PageLoader/PageLoader";
import { detailLoader } from "./pages/detail/loader";
import DetailError from "./pages/DetailError";

const SearchPage = lazy(() => import("./pages/SearchPage"));
const DetailPage = lazy(() => import("./pages/DetailPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<PageLoader />}>
            <SearchPage />
          </Suspense>
        ),
      },
      {
        path: "/detail/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <DetailPage />
          </Suspense>
        ),
        loader: detailLoader,
        errorElement: <DetailError />,
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
