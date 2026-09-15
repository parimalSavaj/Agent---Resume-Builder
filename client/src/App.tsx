import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./features/auth/LoginPage";
import { SignupPage } from "./features/auth/SignupPage";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { VaultPage } from "./features/vault/VaultPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/vault" element={<VaultPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/vault" replace />} />
      <Route path="*" element={<Navigate to="/vault" replace />} />
    </Routes>
  );
}

export default App;
