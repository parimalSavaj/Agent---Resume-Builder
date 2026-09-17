import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BulletPoint, BulletParentType } from "../types";
import * as vaultApi from "../vaultApi";
import { TagInput } from "./TagInput";
import { AnalyzeField } from "./AnalyzeField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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

  const renderEditor = () => (
    <Card className="border-primary/40 bg-primary/5">
      <CardContent className="p-3 space-y-2">
        <AnalyzeField label="Bullet text" value={form.text} onChange={(text) => setForm({ ...form, text })} required />
        <TagInput tags={form.tags} onChange={(tags) => setForm({ ...form, tags })} />
        <Input
          value={form.metric}
          onChange={(e) => setForm({ ...form, metric: e.target.value })}
          placeholder="Optional metric (e.g. reduced cost by 18%)"
        />
        {formError && <p className="text-sm text-destructive">{formError}</p>}
        <div className="flex gap-2">
          <Button size="sm" onClick={submitForm} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button size="sm" variant="outline" onClick={cancelEdit}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="mt-3 border-t pt-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Bullet Points</h4>
        {editingId === null && (
          <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={startCreate}>
            + Add bullet
          </Button>
        )}
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading bullets...</p>}

      <ul className="space-y-2">
        {bullets?.map((bullet) =>
          editingId === bullet.id ? (
            <li key={bullet.id}>{renderEditor()}</li>
          ) : (
            <li key={bullet.id}>
              <Card>
                <CardContent className="p-3">
                  <p className="text-sm">{bullet.text}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    {bullet.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                    {bullet.isUntagged && <Badge variant="warning">Untagged</Badge>}
                    {bullet.metric && <Badge variant="success">{bullet.metric}</Badge>}
                  </div>
                  <div className="mt-2 flex gap-1">
                    <Button variant="ghost" size="sm" className="h-auto px-2 py-1 text-xs" onClick={() => startEdit(bullet)}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto px-2 py-1 text-xs text-destructive hover:text-destructive"
                      onClick={() => deleteMutation.mutate(bullet.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </li>
          ),
        )}
      </ul>

      {editingId === "new" && <div className="mt-2">{renderEditor()}</div>}

      {!isLoading && bullets?.length === 0 && editingId === null && (
        <p className="text-sm text-muted-foreground">No bullet points yet.</p>
      )}
    </div>
  );
}
