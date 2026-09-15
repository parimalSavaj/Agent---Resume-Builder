import { useState } from "react";
import { isAxiosError } from "axios";
import { analyzeText } from "../vaultApi";

interface AnalyzeFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  required?: boolean;
}

/**
 * A textarea paired with an "Analyze" action that sends the current text to the
 * LLM for a typo/grammar/phrasing pass. The correction is shown as a before/after
 * comparison and only replaces the field's value if the person explicitly accepts
 * it - "Save" never touches the AI, and a failed/timed-out analysis leaves the
 * original text untouched.
 */
export function AnalyzeField({ label, value, onChange, rows = 3, placeholder, required }: AnalyzeFieldProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!value.trim()) return;
    setError(null);
    setIsAnalyzing(true);
    try {
      const result = await analyzeText(value);
      setSuggestion(result.correctedText);
    } catch (err) {
      if (isAxiosError<{ error?: string }>(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("AI analysis failed. Your original text is unchanged - you can still Save normally.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const acceptSuggestion = () => {
    if (suggestion) onChange(suggestion);
    setSuggestion(null);
  };

  const rejectSuggestion = () => {
    setSuggestion(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={isAnalyzing || !value.trim()}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? "Analyzing..." : "✨ Analyze"}
        </button>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {suggestion && (
        <div className="mt-2 rounded-md border border-indigo-200 bg-indigo-50 p-3">
          <p className="text-xs font-semibold text-indigo-700 mb-2">AI suggestion - review before applying</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Original</p>
              <p className="rounded bg-white border border-gray-200 p-2 text-gray-700 whitespace-pre-wrap">{value}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Suggested</p>
              <p className="rounded bg-white border border-gray-200 p-2 text-gray-900 whitespace-pre-wrap">
                {suggestion}
              </p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={acceptSuggestion}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              Accept suggestion
            </button>
            <button
              type="button"
              onClick={rejectSuggestion}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Keep original
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
