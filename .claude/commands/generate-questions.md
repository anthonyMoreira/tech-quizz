Generate high-quality quiz questions for the tech-quizz app question bank.

## Instructions

Parse the arguments from: $ARGUMENTS

Expected format: `<theme> <difficulty> <count>`
Example: `ddd beginner 10`

### Step 0 — Validate Arguments

- **theme** must be one of: `ddd`, `tdd`, `solid`, `design-patterns`, `clean-architecture`, `ci-cd`, `microservices`, `refactoring`
- **difficulty** must be one of: `beginner`, `intermediate`, `advanced`
- **count** must be a positive integer (default to 10 if omitted)

If any argument is invalid, stop immediately and tell the user which argument is wrong and what the valid values are.

### Step 1 — Load Context

1. Read the Question JSON schema from `specs/001-tech-quiz-app/data-model.md` to understand the exact data model.
2. Read quality criteria from `specs/001-tech-quiz-app/spec.md` — specifically the "Question Bank Quality Criteria" section.
3. Read existing questions from `frontend/src/data/questions/<theme>.json`.
   - If the file does not exist, create it with contents `[]`.
4. From the existing questions, identify:
   - The highest existing ID number for the given theme + difficulty combination (to continue numbering from there).
   - All concepts already covered at this difficulty level (to avoid duplication).

### Step 2 — Generate Questions

Generate exactly `<count>` questions following **all** of these rules:

#### Schema (every question must match exactly)

```json
{
  "id": "{theme}-{difficulty_prefix}-{NNN}",
  "themeId": "{theme}",
  "difficulty": "{difficulty}",
  "type": "text" | "code-snippet",
  "prompt": "Clear, unambiguous question text ending with a question mark",
  "codeSnippet": null | { "language": "...", "code": "..." },
  "options": [
    { "id": "a", "text": "...", "isCorrect": true | false },
    { "id": "b", "text": "...", "isCorrect": true | false },
    { "id": "c", "text": "...", "isCorrect": true | false },
    { "id": "d", "text": "...", "isCorrect": true | false }
  ],
  "explanation": "Full paragraph explanation...",
  "bonusFact": "Short fact" | null
}
```

#### ID Format

- `{theme}-{first 3 letters of difficulty}-{NNN}` where NNN is zero-padded to 3 digits.
- Examples: `ddd-beg-001`, `tdd-int-005`, `solid-adv-012`
- Number sequentially from where existing questions for this theme+difficulty leave off.

#### Hard Constraints

- **Exactly 4 options** per question, with **exactly 1** having `isCorrect: true`.
- **Explanation** must be a full paragraph: minimum 3 sentences. Must explain WHY the correct answer is right AND briefly address why the other options are wrong.
- **bonusFact** — present on roughly 50% of questions. When present, must be <= 100 characters. When absent, must be `null`.
- **codeSnippet** — for `code-snippet` type questions only. Must include a `language` tag (e.g., `"javascript"`, `"typescript"`, `"java"`, `"python"`, `"csharp"`). Code must be <= 15 lines, realistic (not toy examples), and self-contained.
- **No concept duplication** at the same difficulty level within the theme. Check the existing questions loaded in Step 1.

#### Distribution Rules

- **Type ratio**: ~30% of questions should be `code-snippet` type, ~70% should be `text` type.
- **Concept distribution**: No more than 2 questions per subtopic within a batch of 10. Spread across different aspects of the theme.
- **Distractor quality**: All incorrect options must be plausible, real concepts or approaches — never obviously absurd.

#### Difficulty Calibration

- **beginner**: Core concepts, definitions, fundamental principles, "what is X?" questions.
- **intermediate**: Application of concepts, trade-offs, "when to use X vs Y?", pattern recognition.
- **advanced**: Edge cases, deep mechanics, architectural implications, subtle distinctions, anti-patterns.

### Step 3 — Self-Validate

Before presenting questions, check every generated question against this checklist:

| # | Check | Fail Action |
|---|-------|-------------|
| 1 | Exactly 4 options with exactly 1 correct? | Fix |
| 2 | Explanation >= 3 sentences? | Expand |
| 3 | Explanation addresses why wrong options are wrong? | Expand |
| 4 | bonusFact <= 100 characters (when present)? | Shorten or remove |
| 5 | codeSnippet <= 15 lines (when present)? | Trim |
| 6 | codeSnippet has language tag? | Add |
| 7 | ID follows `{theme}-{diff[0:3]}-{NNN}` format? | Fix |
| 8 | No duplicate concept with existing questions? | Replace |
| 9 | Prompt is clear and unambiguous? | Rewrite |
| 10 | All distractors are plausible? | Replace weak ones |
| 11 | Factually accurate? | Fix or replace |

Fix any failing questions automatically before presenting.

### Step 4 — Present for Review

Display a summary table of all generated questions:

| # | ID | Type | Concept Tested | Prompt (truncated) | Bonus Fact? |
|---|----|------|----------------|-------------------|-------------|
| 1 | ... | text | ... | ... | yes/no |
| 2 | ... | code-snippet | ... | ... | yes/no |

Also show:
- Total text vs code-snippet count
- Concepts covered (to verify no overlap with existing)
- Any self-validation warnings that were auto-fixed

Then ask the user:

> **Review the questions above. You can:**
> 1. **Approve all** — write all questions to the file
> 2. **Reject specific** — list question numbers to drop (e.g., "reject 3, 7")
> 3. **Regenerate specific** — list question numbers to regenerate (e.g., "regenerate 2, 5")
> 4. **Reject all** — discard everything and start over

### Step 5 — Handle User Response

- **Approve all**: Proceed to Step 6 with all questions.
- **Reject specific**: Remove those questions from the batch. Proceed to Step 6 with remaining questions.
- **Regenerate specific**: Generate replacement questions for the specified numbers (following all the same rules, avoiding concepts from both existing questions and the rest of the batch). Run self-validation on replacements. Present updated table and ask for review again.
- **Reject all**: Stop. Do not write anything.

### Step 6 — Write to File

1. Read the current contents of `frontend/src/data/questions/<theme>.json`.
2. Parse the JSON array.
3. Append all approved questions to the array.
4. Write the updated array back to the file, formatted with 2-space indentation.
5. Report the final count: "Added {N} questions to frontend/src/data/questions/<theme>.json. Total questions in file: {total}."
