import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as vaultApi from "../vaultApi";
import type { Skill } from "../types";
import type { SkillInput } from "../vaultApi";

interface FormState {
  name: string;
  category: string;
}

const emptyForm: FormState = { name: "", category: "" };

function toInput(form: FormState): SkillInput {
  return { name: form.name, category: form.category.trim() ? form.category.trim() : null };
}

export function SkillsTab() {
  const queryClient = useQueryClient();
  const { data: items, isLoading } = useQuery({ queryKey: ["skills"], queryFn: vaultApi.listSkills });

  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["skills"] });

  const createMutation = useMutation({
    mutationFn: (input: SkillInput) => vaultApi.createSkill(input),
    onSuccess: () => {
      invalidate();
      setEditingId(null);
      setForm(emptyForm);
    },
    onError: () => setFormError("Failed to save - please try again."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: SkillInput }) => vaultApi.updateSkill(id, input),
    onSuccess: () => {
      invalidate();
      setEditingId(null);
      setForm(emptyForm);
    },
    onError: () => setFormError("Failed to save - please try again."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => vaultApi.deleteSkill(id),
    onSuccess: () => invalidate(),
  });

  const startCreate = () => {
    setEditingId("new");
    setForm(emptyForm);
    setFormError(null);
  };

  const startEdit = (item: Skill) => {
    setEditingId(item.id);
    setForm({ name: item.name, category: item.category ?? "" });
    setFormError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
  };

  const submit = () => {
    if (!form.name.trim()) {
      setFormError("Skill name is required");
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="e.g. Programming Languages"
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
        <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
        {editingId === null && (
          <button
            type="button"
            onClick={startCreate}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            + Add skill
          </button>
        )}
      </div>

      {editingId === "new" && renderForm()}

      {isLoading && <p className="text-sm text-gray-400">Loading...</p>}

      <ul className="space-y-2">
        {items?.map((item) =>
          editingId === item.id ? (
            <li key={item.id}>{renderForm()}</li>
          ) : (
            <li key={item.id} className="flex items-center justify-between rounded-md border border-gray-200 p-3">
              <div>
                <span className="font-medium text-gray-900">{item.name}</span>
                {item.category && <span className="ml-2 text-sm text-gray-500">({item.category})</span>}
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
            </li>
          ),
        )}
      </ul>

      {!isLoading && items?.length === 0 && editingId === null && (
        <p className="text-sm text-gray-400">No skills yet.</p>
      )}
    </div>
  );
}
