import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as vaultApi from "../vaultApi";
import type { WorkExperience } from "../types";
import type { WorkExperienceInput } from "../vaultApi";
import { BulletList } from "../components/BulletList";

interface FormState {
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

const emptyForm: FormState = { company: "", title: "", location: "", startDate: "", endDate: "", isCurrent: false };

function toInput(form: FormState): WorkExperienceInput {
  return {
    company: form.company,
    title: form.title,
    location: form.location.trim() ? form.location.trim() : null,
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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["work-experiences"] });

  const createMutation = useMutation({
    mutationFn: (input: WorkExperienceInput) => vaultApi.createWorkExperience(input),
    onSuccess: (created) => {
      invalidate();
      setEditingId(null);
      setForm(emptyForm);
      setExpandedId(created.id);
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
    <div className="rounded-md border border-indigo-200 bg-indigo-50/40 p-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <input
          type="text"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start date *</label>
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
            disabled={form.isCurrent}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
          />
          <label className="mt-1 flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={form.isCurrent}
              onChange={(e) => setForm({ ...form, isCurrent: e.target.checked, endDate: "" })}
            />
            I currently work here
          </label>
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
        <h2 className="text-lg font-semibold text-gray-900">Work Experience</h2>
        {editingId === null && (
          <button
            type="button"
            onClick={startCreate}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            + Add work experience
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
                  <p className="font-medium text-gray-900">
                    {item.title} · {item.company}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.location ? `${item.location} · ` : ""}
                    {item.startDate} – {item.endDate ?? "Present"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {expandedId === item.id ? "Hide bullets" : "Bullets"}
                  </button>
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
              {expandedId === item.id && <BulletList parentType="work_experience" parentId={item.id} />}
            </li>
          ),
        )}
      </ul>

      {!isLoading && items?.length === 0 && editingId === null && (
        <p className="text-sm text-gray-400">No work experience entries yet.</p>
      )}
    </div>
  );
}
