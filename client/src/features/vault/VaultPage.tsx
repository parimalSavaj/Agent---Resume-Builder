import { useAuth } from "../auth/AuthContext";
import { WorkExperienceTab } from "./tabs/WorkExperienceTab";
import { ProjectsTab } from "./tabs/ProjectsTab";
import { EducationTab } from "./tabs/EducationTab";
import { CertificationsTab } from "./tabs/CertificationsTab";
import { SkillsTab } from "./tabs/SkillsTab";
import { ThemeToggle } from "@/lib/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/Logo";

const TABS = [
  { id: "work-experience", label: "Work Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "skills", label: "Skills" },
] as const;

export function VaultPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo />
            <span className="hidden sm:inline-block h-6 w-px bg-border" />
            <h1 className="hidden text-sm font-medium text-muted-foreground sm:inline">
              Master Vault
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Signed in as <span className="font-medium text-foreground">{user?.username}</span>
            </span>
            <Button variant="link" onClick={() => void logout()} className="h-auto p-0">
              Log out
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <Tabs defaultValue="work-experience" className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
        <TabsList className="flex w-full flex-wrap justify-start h-auto">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="work-experience" className="mt-6">
          <WorkExperienceTab />
        </TabsContent>
        <TabsContent value="projects" className="mt-6">
          <ProjectsTab />
        </TabsContent>
        <TabsContent value="education" className="mt-6">
          <EducationTab />
        </TabsContent>
        <TabsContent value="certifications" className="mt-6">
          <CertificationsTab />
        </TabsContent>
        <TabsContent value="skills" className="mt-6">
          <SkillsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
