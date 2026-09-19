import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as vaultApi from "../vaultApi";
import type { Education } from "../types";
import type { EducationInput } from "../vaultApi";
import { MonthYearPicker } from "../components/MonthYearPicker";
import { formatMonthYear } from "../lib/formatMonthYear";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormState {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

const emptyForm: FormState = { institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "" };

function toInput(form: FormState): EducationInput {
  return {
    institution: form.institution,
    degree: form.degree.trim() ? form.degree.trim() : null,
    fieldOfStudy: form.fieldOfStudy.trim() ? form.fieldOfStudy.trim() : null,
    startDate: form.startDate || null,
    endDate: form.endDate || null,
  };
}

export function EducationTab() {
  const queryClient = useQueryClient();
  const { data: items, isLoading } = useQuery({ queryKey: ["education"], queryFn: vaultApi.listEducation });

  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["education"] });

  const createMutation = useMutation({
    mutationFn: (input: EducationInput) => vaultApi.createEducation(input),
    onSuccess: () => {
      invalidate();
      setEditingId(null);
      setForm(emptyForm);
    },
    onError: () => setFormError("Failed to save - please try again."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: EducationInput }) => vaultApi.updateEducation(id, input),
    onSuccess: () => {
      invalidate();
      setEditingId(null);
      setForm(emptyForm);
    },
    onError: () => setFormError("Failed to save - please try again."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => vaultApi.deleteEducation(id),
    onSuccess: () => invalidate(),
  });

  const startCreate = () => {
    setEditingId("new");
    setForm(emptyForm);
    setFormError(null);
  };

  const startEdit = (item: Education) => {
    setEditingId(item.id);
    setForm({
      institution: item.institution,
      degree: item.degree ?? "",
      fieldOfStudy: item.fieldOfStudy ?? "",
      startDate: item.startDate ?? "",
      endDate: item.endDate ?? "",
    });
    setFormError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
  };

  const submit = () => {
    if (!form.institution.trim()) {
      setFormError("Institution is required");
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
        <div className="space-y-1.5">
          <Label>Institution *</Label>
          <Input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Degree</Label>
            <Input value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Field of study</Label>
            <Input
              value={form.fieldOfStudy}
              onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Start date</Label>
            <MonthYearPicker
              value={form.startDate || null}
              onChange={(startDate) => setForm({ ...form, startDate: startDate ?? "" })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>End date</Label>
            <MonthYearPicker
              value={form.endDate || null}
              onChange={(endDate) => setForm({ ...form, endDate: endDate ?? "" })}
            />
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
        <h2 className="text-lg font-semibold">Education</h2>
        {editingId === null && (
          <Button size="sm" onClick={startCreate}>
            + Add education
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
                      <p className="font-medium">{item.institution}</p>
                      <p className="text-sm text-muted-foreground">
                        {[item.degree, item.fieldOfStudy].filter(Boolean).join(", ")}
                      </p>
                      {(item.startDate || item.endDate) && (
                        <p className="text-sm text-muted-foreground">
                          {formatMonthYear(item.startDate) ?? "?"} – {formatMonthYear(item.endDate) ?? "Present"}
                        </p>
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
        <p className="text-sm text-muted-foreground">No education entries yet.</p>
      )}
    </div>
  );
}
