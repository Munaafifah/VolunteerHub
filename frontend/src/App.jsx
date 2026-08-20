import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AppShell from "./components/AppShell";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import ActivityDetailsPage from "./pages/ActivityDetailsPage";
import RegisterActivityPage from "./pages/RegisterActivityPage";
import MyRegistrationsPage from "./pages/MyRegistrationsPage";
import AdminActivitiesPage from "./pages/AdminActivitiesPage";
import ActivityFormPage from "./pages/ActivityFormPage";
import AdminReportsPage from "./pages/AdminReportsPage";
import AdminRegistrationsPage from "./pages/AdminRegistrationsPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/activities/:id" element={<ActivityDetailsPage />} />
            <Route path="/activities/:id/register" element={<RegisterActivityPage />} />
            <Route path="/registrations" element={<MyRegistrationsPage />} />

            <Route element={<AdminRoute />}>
              <Route path="/admin/activities" element={<AdminActivitiesPage />} />
              <Route path="/admin/activities/new" element={<ActivityFormPage />} />
              <Route path="/admin/activities/:activityId/edit" element={<ActivityFormPage />} />
              <Route path="/admin/registrations" element={<AdminRegistrationsPage />} />
              <Route path="/admin/reports" element={<AdminReportsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}