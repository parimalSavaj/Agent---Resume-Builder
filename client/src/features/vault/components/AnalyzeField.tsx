import { useState } from "react";
import { isAxiosError } from "axios";
import { Sparkles } from "lucide-react";
import { analyzeText } from "../vaultApi";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
        <Label>
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-auto p-0 text-xs"
          onClick={handleAnalyze}
          disabled={isAnalyzing || !value.trim()}
        >
          <Sparkles className="mr-1" />
          {isAnalyzing ? "Analyzing..." : "Analyze"}
        </Button>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
      />

      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}

      {suggestion && (
        <div className="mt-2 rounded-md border border-primary/40 bg-primary/5 p-3">
          <p className="text-xs font-semibold text-primary mb-2">AI suggestion - review before applying</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Original</p>
              <p className="rounded border bg-background p-2 text-foreground whitespace-pre-wrap">{value}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Suggested</p>
              <p className="rounded border bg-background p-2 text-foreground whitespace-pre-wrap">{suggestion}</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={acceptSuggestion}>
              Accept suggestion
            </Button>
            <Button size="sm" variant="outline" onClick={rejectSuggestion}>
              Keep original
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
