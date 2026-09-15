import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as vaultApi from "../vaultApi";
import type { BulletParentType, BulletPointFilters } from "../types";

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
      <h2 className="text-lg font-semibold text-gray-900">Search Bullets</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 rounded-md border border-gray-200 p-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Tag</label>
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="e.g. Leadership"
            className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Parent type</label>
          <select
            value={parentType}
            onChange={(e) => {
              setParentType(e.target.value as BulletParentType | "");
              setParentId("");
            }}
            className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Any</option>
            <option value="work_experience">Work experience</option>
            <option value="project">Project</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Parent</label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            disabled={!parentType}
            className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
          >
            <option value="">Any</option>
            {parentOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">From date</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">To date</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {isLoading && <p className="text-sm text-gray-400">Searching...</p>}

      <ul className="space-y-2">
        {bullets?.map((bullet) => (
          <li key={bullet.id} className="rounded-md border border-gray-200 p-3">
            <p className="text-xs text-gray-400 mb-1">{parentLabelFor(bullet.parentType, bullet.parentId)}</p>
            <p className="text-sm text-gray-800">{bullet.text}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {bullet.tags.map((t) => (
                <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  {t}
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
          </li>
        ))}
      </ul>

      {!isLoading && bullets?.length === 0 && (
        <p className="text-sm text-gray-400">No bullet points match these filters.</p>
      )}
    </div>
  );
}
