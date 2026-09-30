import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import KnowledgeAdmin from "./pages/KnowledgeAdmin";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";

import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>

      {/* =============================== */}
      {/* Login */}
      {/* =============================== */}

      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate
              to="/dashboard"
              replace
            />
          ) : (
            <Login />
          )
        }
      />

      {/* =============================== */}
      {/* Dashboard */}
      {/* =============================== */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* =============================== */}
      {/* Knowledge - ADMIN ONLY */}
      {/* =============================== */}

      <Route
        path="/knowledge"
        element={
          <ProtectedRoute>
            {user?.role === "admin" ? (
              <KnowledgeAdmin />
            ) : (
              <Navigate
                to="/dashboard"
                replace
              />
            )}
          </ProtectedRoute>
        }
      />

      {/* =============================== */}
      {/* Profile */}
      {/* =============================== */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* =============================== */}
      {/* Settings */}
      {/* =============================== */}

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* =============================== */}
      {/* Invalid Route */}
      {/* =============================== */}

      <Route
        path="*"
        element={
          <Navigate
            to={
              isAuthenticated
                ? "/dashboard"
                : "/"
            }
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;