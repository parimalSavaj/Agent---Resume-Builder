import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { WorkExperienceTab } from "./tabs/WorkExperienceTab";
import { ProjectsTab } from "./tabs/ProjectsTab";
import { EducationTab } from "./tabs/EducationTab";
import { CertificationsTab } from "./tabs/CertificationsTab";
import { SkillsTab } from "./tabs/SkillsTab";
import { SearchTab } from "./tabs/SearchTab";

const TABS = [
  { id: "work-experience", label: "Work Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "skills", label: "Skills" },
  { id: "search", label: "Search" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function VaultPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("work-experience");

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

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label="Master Vault sections">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === "work-experience" && <WorkExperienceTab />}
        {activeTab === "projects" && <ProjectsTab />}
        {activeTab === "education" && <EducationTab />}
        {activeTab === "certifications" && <CertificationsTab />}
        {activeTab === "skills" && <SkillsTab />}
        {activeTab === "search" && <SearchTab />}
      </main>
    </div>
  );
}
