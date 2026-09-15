import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as vaultApi from "../vaultApi";
import type { Certification } from "../types";
import type { CertificationInput } from "../vaultApi";

interface FormState {
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate: string;
  credentialId: string;
}

const emptyForm: FormState = { name: "", issuer: "", issueDate: "", expirationDate: "", credentialId: "" };

function toInput(form: FormState): CertificationInput {
  return {
    name: form.name,
    issuer: form.issuer.trim() ? form.issuer.trim() : null,
    issueDate: form.issueDate || null,
    expirationDate: form.expirationDate || null,
    credentialId: form.credentialId.trim() ? form.credentialId.trim() : null,
  };
}

export function CertificationsTab() {
  const queryClient = useQueryClient();
  const { data: items, isLoading } = useQuery({
    queryKey: ["certifications"],
    queryFn: vaultApi.listCertifications,
  });

  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["certifications"] });

  const createMutation = useMutation({
    mutationFn: (input: CertificationInput) => vaultApi.createCertification(input),
    onSuccess: () => {
      invalidate();
      setEditingId(null);
      setForm(emptyForm);
    },
    onError: () => setFormError("Failed to save - please try again."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: CertificationInput }) => vaultApi.updateCertification(id, input),
    onSuccess: () => {
      invalidate();
      setEditingId(null);
      setForm(emptyForm);
    },
    onError: () => setFormError("Failed to save - please try again."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => vaultApi.deleteCertification(id),
    onSuccess: () => invalidate(),
  });

  const startCreate = () => {
    setEditingId("new");
    setForm(emptyForm);
    setFormError(null);
  };

  const startEdit = (item: Certification) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      issuer: item.issuer ?? "",
      issueDate: item.issueDate ?? "",
      expirationDate: item.expirationDate ?? "",
      credentialId: item.credentialId ?? "",
    });
    setFormError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
  };

  const submit = () => {
    if (!form.name.trim()) {
      setFormError("Certification name is required");
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Issuer</label>
          <input
            type="text"
            value={form.issuer}
            onChange={(e) => setForm({ ...form, issuer: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Issue date</label>
          <input
            type="date"
            value={form.issueDate}
            onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiration date</label>
          <input
            type="date"
            value={form.expirationDate}
            onChange={(e) => setForm({ ...form, expirationDate: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Credential ID</label>
        <input
          type="text"
          value={form.credentialId}
          onChange={(e) => setForm({ ...form, credentialId: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
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
        <h2 className="text-lg font-semibold text-gray-900">Certifications</h2>
        {editingId === null && (
          <button
            type="button"
            onClick={startCreate}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            + Add certification
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
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.issuer}</p>
                  {(item.issueDate || item.expirationDate) && (
                    <p className="text-sm text-gray-500">
                      {item.issueDate ?? "?"} – {item.expirationDate ?? "No expiration"}
                    </p>
                  )}
                  {item.credentialId && <p className="text-xs text-gray-400">ID: {item.credentialId}</p>}
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
        <p className="text-sm text-gray-400">No certifications yet.</p>
      )}
    </div>
  );
}
