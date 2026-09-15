import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BulletPoint, BulletParentType } from "../types";
import * as vaultApi from "../vaultApi";
import { TagInput } from "./TagInput";
import { AnalyzeField } from "./AnalyzeField";

interface BulletListProps {
  parentType: BulletParentType;
  parentId: string;
}

interface BulletFormState {
  text: string;
  tags: string[];
  metric: string;
}

const emptyForm: BulletFormState = { text: "", tags: [], metric: "" };

/** Bullet point editor nested under a single work experience or project entry. */
export function BulletList({ parentType, parentId }: BulletListProps) {
  const queryClient = useQueryClient();
  const queryKey = ["bullet-points", parentType, parentId];

  const { data: bullets, isLoading } = useQuery({
    queryKey,
    queryFn: () => vaultApi.listBulletPoints({ parentType, parentId }),
  });

  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<BulletFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const createMutation = useMutation({
    mutationFn: (input: BulletFormState) =>
      vaultApi.createBulletPoint({
        parentType,
        parentId,
        text: input.text,
        tags: input.tags,
        metric: input.metric.trim() ? input.metric.trim() : null,
      }),
    onSuccess: () => {
      invalidate();
      setEditingId(null);
      setForm(emptyForm);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: BulletFormState }) =>
      vaultApi.updateBulletPoint(id, {
        text: input.text,
        tags: input.tags,
        metric: input.metric.trim() ? input.metric.trim() : null,
      }),
    onSuccess: () => {
      invalidate();
      setEditingId(null);
      setForm(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => vaultApi.deleteBulletPoint(id),
    onSuccess: () => invalidate(),
  });

  const startEdit = (bullet: BulletPoint) => {
    setEditingId(bullet.id);
    setForm({ text: bullet.text, tags: bullet.tags, metric: bullet.metric ?? "" });
    setFormError(null);
  };

  const startCreate = () => {
    setEditingId("new");
    setForm(emptyForm);
    setFormError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
  };

  const submitForm = () => {
    if (!form.text.trim()) {
      setFormError("Bullet text is required");
      return;
    }
    if (editingId === "new") {
      createMutation.mutate(form);
    } else if (editingId) {
      updateMutation.mutate({ id: editingId, input: form });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Bullet Points</h4>
        {editingId === null && (
          <button
            type="button"
            onClick={startCreate}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
          >
            + Add bullet
          </button>
        )}
      </div>

      {isLoading && <p className="text-sm text-gray-400">Loading bullets...</p>}

      <ul className="space-y-2">
        {bullets?.map((bullet) =>
          editingId === bullet.id ? (
            <li key={bullet.id} className="rounded-md border border-indigo-200 bg-indigo-50/40 p-3 space-y-2">
              <AnalyzeField label="Bullet text" value={form.text} onChange={(text) => setForm({ ...form, text })} required />
              <TagInput tags={form.tags} onChange={(tags) => setForm({ ...form, tags })} />
              <input
                type="text"
                value={form.metric}
                onChange={(e) => setForm({ ...form, metric: e.target.value })}
                placeholder="Optional metric (e.g. reduced cost by 18%)"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {formError && <p className="text-sm text-red-600">{formError}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={submitForm}
                  disabled={isSaving}
                  className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </li>
          ) : (
            <li key={bullet.id} className="rounded-md border border-gray-200 p-3">
              <p className="text-sm text-gray-800">{bullet.text}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                {bullet.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {tag}
                  </span>
                ))}
                {bullet.isUntagged && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    Untagged
                  </span>
                )}
                {bullet.metric && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    {bullet.metric}
                  </span>
                )}
              </div>
              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => startEdit(bullet)}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(bullet.id)}
                  className="text-xs font-medium text-red-600 hover:text-red-500"
                >
                  Delete
                </button>
              </div>
            </li>
          ),
        )}
      </ul>

      {editingId === "new" && (
        <li className="mt-2 list-none rounded-md border border-indigo-200 bg-indigo-50/40 p-3 space-y-2">
          <AnalyzeField label="Bullet text" value={form.text} onChange={(text) => setForm({ ...form, text })} required />
          <TagInput tags={form.tags} onChange={(tags) => setForm({ ...form, tags })} />
          <input
            type="text"
            value={form.metric}
            onChange={(e) => setForm({ ...form, metric: e.target.value })}
            placeholder="Optional metric (e.g. reduced cost by 18%)"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {formError && <p className="text-sm text-red-600">{formError}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={submitForm}
              disabled={isSaving}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </li>
      )}

      {!isLoading && bullets?.length === 0 && editingId === null && (
        <p className="text-sm text-gray-400">No bullet points yet.</p>
      )}
    </div>
  );
}
