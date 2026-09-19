import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as vaultApi from "../vaultApi";
import type { WorkExperience } from "../types";
import type { WorkExperienceInput } from "../vaultApi";
import { AnalyzeField } from "../components/AnalyzeField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormState {
  company: string;
  title: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

const emptyForm: FormState = {
  company: "",
  title: "",
  location: "",
  description: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
};

function toInput(form: FormState): WorkExperienceInput {
  return {
    company: form.company,
    title: form.title,
    location: form.location.trim() ? form.location.trim() : null,
    description: form.description.trim() ? form.description.trim() : null,
    startDate: form.startDate,
    endDate: form.isCurrent ? null : form.endDate || null,
  };
}

export function WorkExperienceTab() {
  const queryClient = useQueryClient();
  const { data: items, isLoading } = useQuery({
    queryKey: ["work-experiences"],
    queryFn: vaultApi.listWorkExperiences,
  });

  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["work-experiences"] });

  const createMutation = useMutation({
    mutationFn: (input: WorkExperienceInput) => vaultApi.createWorkExperience(input),
    onSuccess: () => {
      invalidate();
      setEditingId(null);
      setForm(emptyForm);
    },
    onError: () => setFormError("Failed to save - please try again."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: WorkExperienceInput }) =>
      vaultApi.updateWorkExperience(id, input),
    onSuccess: () => {
      invalidate();
      setEditingId(null);
      setForm(emptyForm);
    },
    onError: () => setFormError("Failed to save - please try again."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => vaultApi.deleteWorkExperience(id),
    onSuccess: () => invalidate(),
  });

  const startCreate = () => {
    setEditingId("new");
    setForm(emptyForm);
    setFormError(null);
  };

  const startEdit = (item: WorkExperience) => {
    setEditingId(item.id);
    setForm({
      company: item.company,
      title: item.title,
      location: item.location ?? "",
      description: item.description ?? "",
      startDate: item.startDate,
      endDate: item.endDate ?? "",
      isCurrent: item.endDate === null,
    });
    setFormError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
  };

  const submit = () => {
    if (!form.company.trim() || !form.title.trim() || !form.startDate) {
      setFormError("Company, title, and start date are required");
      return;
    }
    setFormError(null);
    const input = toInput(form);
    if (editingId === "new") {
      createMutation.mutate(input);
    } else if (editingId) {
      updateMutation.mutate({ id: editingId, input });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const renderForm = () => (
    <Card className="border-primary/40 bg-primary/5">
      <CardContent className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Company *</Label>
            <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Title *</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Location</Label>
          <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </div>
        <AnalyzeField
          label="Description"
          value={form.description}
          onChange={(description) => setForm({ ...form, description })}
          entryType="work_experience"
          context={{ title: form.title, company: form.company }}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Start date *</Label>
            <Input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>End date</Label>
            <Input
              type="date"
              value={form.endDate}
              disabled={form.isCurrent}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
            <label className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={form.isCurrent}
                onChange={(e) => setForm({ ...form, isCurrent: e.target.checked, endDate: "" })}
              />
              I currently work here
            </label>
          </div>
        </div>
        {formError && <p className="text-sm text-destructive">{formError}</p>}
        <div className="flex gap-2">
          <Button onClick={submit} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={cancelEdit}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Work Experience</h2>
        {editingId === null && (
          <Button size="sm" onClick={startCreate}>
            + Add work experience
          </Button>
        )}
      </div>

      {editingId === "new" && renderForm()}

      {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}

      <ul className="space-y-3">
        {items?.map((item) =>
          editingId === item.id ? (
            <li key={item.id}>{renderForm()}</li>
          ) : (
            <li key={item.id}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">
                        {item.title} · {item.company}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.location ? `${item.location} · ` : ""}
                        {item.startDate} – {item.endDate ?? "Present"}
                      </p>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => startEdit(item)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteMutation.mutate(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </li>
          ),
        )}
      </ul>

      {!isLoading && items?.length === 0 && editingId === null && (
        <p className="text-sm text-muted-foreground">No work experience entries yet.</p>
      )}
    </div>
  );
}
