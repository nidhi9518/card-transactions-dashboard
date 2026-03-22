import { RouterProvider } from "react-router-dom";
import { router } from "./AppRoutes";
import { ErrorBoundary } from "./common/components/error-boundary/ErrorBoundary";

function App() {
  return (
    <main>
      <ErrorBoundary>
        <RouterProvider router={router}></RouterProvider>
      </ErrorBoundary>
    </main>
  );
}

export default App;
