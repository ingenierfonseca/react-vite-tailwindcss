import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../features/auth/LoginPage";
import NotFoundPage from "../features/not-found/NotFoundPage";
import { ProtectedRoute } from "../components/commons/ProtectedRoute";
import { routesConfig } from "./routesConfig";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            {routesConfig.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
            <Route path="/not-found" element={<NotFoundPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
