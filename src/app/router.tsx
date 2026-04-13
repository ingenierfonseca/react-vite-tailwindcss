import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import MainLayout from "../layouts/MainLayout";
import { routesConfig } from "./routesConfig";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />} >
          <Route index element={<Navigate to="/dashboard" replace />} />
            {routesConfig.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}