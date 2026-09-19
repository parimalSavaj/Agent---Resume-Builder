export type AnalyzeEntryType = 'work_experience' | 'project';

export type AnalyzeContext = {
  title: string;
  company?: string | null;
};

/**
 * Builds the system prompt sent to the LLM for the vault "Analyze" feature.
 *
 * This is deliberately kept in the application layer (not infrastructure):
 * deciding *how* to talk about a work experience versus a project is a
 * domain/business concern, not a transport detail. The OpenRouter service
 * stays generic and just sends whatever prompt it's given.
 *
 * The shared framing across both entry types matters: this text isn't a
 * one-off note - once accepted, it becomes permanent vault data that the
 * future matching engine reads and scores against real job descriptions.
 * So the goal here is not "fix typos", it's "produce the clearest, most
 * specific, most factually-grounded version of what the user already wrote",
 * because vague or generic descriptions are much harder for a matching
 * engine to score well against a job description later.
 */
export class AnalyzePromptBuilder {
  private static readonly SHARED_RULES = [
    'Preserve every fact exactly as given: technologies, tools, numbers, dates, scope, and outcomes.',
    'Never invent or add a metric, tool, responsibility, or achievement that is not stated or clearly implied by the draft.',
    'If the draft is vague, sharpen the language using only what the given context and draft already imply - do not guess specifics that are not there.',
    'Prefer concrete, specific wording over generic filler. Name technologies, actions, and outcomes explicitly when present in the draft.',
    'Write in a natural, professional resume tone - not keyword-stuffed, not robotic.',
    'This text will be stored as profile data and later compared against real job descriptions by an automated matching engine, so specificity and factual accuracy both matter more than politeness or length.',
    'Respond with ONLY the improved text - no explanation, no quotes, no markdown formatting.',
  ];

  static build(entryType: AnalyzeEntryType, context: AnalyzeContext): string {
    switch (entryType) {
      case 'work_experience':
        return this.buildWorkExperiencePrompt(context);
      case 'project':
        return this.buildProjectPrompt(context);
    }
  }

  private static buildWorkExperiencePrompt(context: AnalyzeContext): string {
    const roleLine = context.company
      ? `The user worked as "${context.title}" at "${context.company}".`
      : `The user worked as "${context.title}".`;

    return [
      'You are a resume writing assistant helping improve the description of a work experience entry.',
      roleLine,
      'Rewrite the draft below into a clear, achievement-oriented description of what the person actually did and accomplished in this role.',
      'Favor concrete responsibilities and measurable impact over vague duties.',
      ...this.SHARED_RULES,
    ].join(' ');
  }

  private static buildProjectPrompt(context: AnalyzeContext): string {
    return [
      'You are a resume writing assistant helping improve the description of a personal or professional project.',
      `The project is called "${context.title}".`,
      'Rewrite the draft below into a clear description of what was built, the technologies or approach used, and the outcome or purpose of the project.',
      'Favor concrete technical detail and outcomes over vague summaries.',
      ...this.SHARED_RULES,
    ].join(' ');
  }
}
