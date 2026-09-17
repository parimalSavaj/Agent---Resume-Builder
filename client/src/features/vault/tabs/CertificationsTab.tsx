import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as vaultApi from "../vaultApi";
import type { Certification } from "../types";
import type { CertificationInput } from "../vaultApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <Card className="border-primary/40 bg-primary/5">
      <CardContent className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Name *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Issuer</Label>
            <Input value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Issue date</Label>
            <Input
              type="date"
              value={form.issueDate}
              onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Expiration date</Label>
            <Input
              type="date"
              value={form.expirationDate}
              onChange={(e) => setForm({ ...form, expirationDate: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Credential ID</Label>
          <Input value={form.credentialId} onChange={(e) => setForm({ ...form, credentialId: e.target.value })} />
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
        <h2 className="text-lg font-semibold">Certifications</h2>
        {editingId === null && (
          <Button size="sm" onClick={startCreate}>
            + Add certification
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
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.issuer}</p>
                      {(item.issueDate || item.expirationDate) && (
                        <p className="text-sm text-muted-foreground">
                          {item.issueDate ?? "?"} – {item.expirationDate ?? "No expiration"}
                        </p>
                      )}
                      {item.credentialId && (
                        <p className="text-xs text-muted-foreground">ID: {item.credentialId}</p>
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
        <p className="text-sm text-muted-foreground">No certifications yet.</p>
      )}
    </div>
  );
}
