import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as vaultApi from "../vaultApi";
import type { Education } from "../types";
import type { EducationInput } from "../vaultApi";

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
    <div className="rounded-md border border-indigo-200 bg-indigo-50/40 p-4 space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Institution *</label>
        <input
          type="text"
          value={form.institution}
          onChange={(e) => setForm({ ...form, institution: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
          <input
            type="text"
            value={form.degree}
            onChange={(e) => setForm({ ...form, degree: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Field of study</label>
          <input
            type="text"
            value={form.fieldOfStudy}
            onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start date</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End date</label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      {formError && <p className="text-sm text-red-600">{formError}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={isSaving}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={cancelEdit}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Education</h2>
        {editingId === null && (
          <button
            type="button"
            onClick={startCreate}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            + Add education
          </button>
        )}
      </div>

      {editingId === "new" && renderForm()}

      {isLoading && <p className="text-sm text-gray-400">Loading...</p>}

      <ul className="space-y-3">
        {items?.map((item) =>
          editingId === item.id ? (
            <li key={item.id}>{renderForm()}</li>
          ) : (
            <li key={item.id} className="rounded-md border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.institution}</p>
                  <p className="text-sm text-gray-500">
                    {[item.degree, item.fieldOfStudy].filter(Boolean).join(", ")}
                  </p>
                  {(item.startDate || item.endDate) && (
                    <p className="text-sm text-gray-500">
                      {item.startDate ?? "?"} – {item.endDate ?? "Present"}
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(item.id)}
                    className="text-sm font-medium text-red-600 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ),
        )}
      </ul>

      {!isLoading && items?.length === 0 && editingId === null && (
        <p className="text-sm text-gray-400">No education entries yet.</p>
      )}
    </div>
  );
}
