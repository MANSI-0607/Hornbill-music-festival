import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Decode JWT payload (base64) and check expiry + isAdmin flag
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp && payload.exp * 1000 < Date.now();
    const isAdmin = payload.isAdmin === true;

    if (isExpired || !isAdmin) {
      localStorage.removeItem("adminToken");
      return <Navigate to="/admin/login" replace />;
    }
  } catch {
    // Malformed token
    localStorage.removeItem("adminToken");
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
