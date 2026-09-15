import { useAuth } from "../auth/AuthContext";

/**
 * Placeholder landing page after login. The actual Master Vault UI
 * (work experience / projects / education / certifications / skills tabs)
 * is Feature 2 and will replace this.
 */
export function VaultPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">Master Vault</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Signed in as {user?.username}</span>
            <button
              type="button"
              onClick={() => void logout()}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <p className="text-sm text-gray-500">
          Vault entries (work experience, projects, education, certifications, skills) will live here.
        </p>
      </main>
    </div>
  );
}
