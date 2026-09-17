import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as vaultApi from "../vaultApi";
import type { BulletParentType, BulletPointFilters } from "../types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ANY = "any";

/**
 * Cross-vault bullet search: filter by tag, date range (of the parent job/project),
 * or a specific parent job/project - per the Master Vault spec's search requirement.
 */
export function SearchTab() {
  const [tag, setTag] = useState("");
  const [parentType, setParentType] = useState<BulletParentType | "">("");
  const [parentId, setParentId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data: workExperiences } = useQuery({
    queryKey: ["work-experiences"],
    queryFn: vaultApi.listWorkExperiences,
  });
  const { data: projects } = useQuery({ queryKey: ["projects"], queryFn: vaultApi.listProjects });

  const parentOptions = useMemo(() => {
    if (parentType === "work_experience") {
      return (workExperiences ?? []).map((we) => ({ id: we.id, label: `${we.title} · ${we.company}` }));
    }
    if (parentType === "project") {
      return (projects ?? []).map((p) => ({ id: p.id, label: p.name }));
    }
    return [];
  }, [parentType, workExperiences, projects]);

  const parentLabelFor = (type: BulletParentType, id: string): string => {
    if (type === "work_experience") {
      const we = workExperiences?.find((w) => w.id === id);
      return we ? `${we.title} · ${we.company}` : "Work experience";
    }
    const p = projects?.find((proj) => proj.id === id);
    return p ? p.name : "Project";
  };

  const filters: BulletPointFilters = {
    tag: tag.trim() || undefined,
    parentType: parentType || undefined,
    parentId: parentId || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  };

  const { data: bullets, isLoading } = useQuery({
    queryKey: ["bullet-points", "search", filters],
    queryFn: () => vaultApi.listBulletPoints(filters),
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Search Bullets</h2>

      <Card>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Tag</Label>
            <Input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="e.g. Leadership" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Parent type</Label>
            <Select
              value={parentType === "" ? ANY : parentType}
              onValueChange={(value) => {
                setParentType(value === ANY ? "" : (value as BulletParentType));
                setParentId("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Any</SelectItem>
                <SelectItem value="work_experience">Work experience</SelectItem>
                <SelectItem value="project">Project</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Parent</Label>
            <Select
              value={parentId === "" ? ANY : parentId}
              onValueChange={(value) => setParentId(value === ANY ? "" : value)}
              disabled={!parentType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Any</SelectItem>
                {parentOptions.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">From date</Label>
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">To date</Label>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {isLoading && <p className="text-sm text-muted-foreground">Searching...</p>}

      <ul className="space-y-2">
        {bullets?.map((bullet) => (
          <li key={bullet.id}>
            <Card>
              <CardContent className="p-3">
                <p className="text-xs text-muted-foreground mb-1">
                  {parentLabelFor(bullet.parentType, bullet.parentId)}
                </p>
                <p className="text-sm">{bullet.text}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {bullet.tags.map((t) => (
                    <Badge key={t} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                  {bullet.isUntagged && <Badge variant="warning">Untagged</Badge>}
                  {bullet.metric && <Badge variant="success">{bullet.metric}</Badge>}
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      {!isLoading && bullets?.length === 0 && (
        <p className="text-sm text-muted-foreground">No bullet points match these filters.</p>
      )}
    </div>
  );
}
