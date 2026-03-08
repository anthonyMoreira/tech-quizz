export const MemoryPlugin = async ({ client, $ }) => {
  const MEMORY_PROMPT = `---
description: Review the current session and save key learnings to persistent memory using the memory CLI tool.
---

## Task

Review this coding session and save genuinely useful, recurring knowledge to persistent memory.

## Step 1 — Load the session transcript

Check the \`MEMORY_TRANSCRIPT_PATH\` environment variable.

- **If set**: Use the Read tool to read that file. It is a JSONL file (one JSON object per line). Parse each line and reconstruct the conversation: extract \`role\` and \`content\` from each message object. Ignore tool-use and tool-result lines — focus on the human/assistant dialogue and any code or commands that were discussed.
- **If not set**: Review the current conversation context directly.

## Step 2 — Identify what to save

Apply a strict filter. Only save a memory if it meets ALL of these criteria:

1. **Recurring value**: It would be useful in future sessions, not just this one task.
2. **Non-obvious**: It's not common knowledge — it's a project-specific decision, a discovered pattern, a resolved ambiguity, or a hard-won insight.
3. **Actionable**: Another agent (or future-you) could act differently based on knowing it.

**Save these**:
- Project conventions (naming, structure, style decisions)
- Technical decisions and their rationale (why X was chosen over Y)
- Architecture patterns specific to this codebase
- Gotchas, edge cases, or non-obvious constraints discovered
- Tool/library behaviors that were surprising or important
- Business context that affects implementation choices

**Skip these**:
- Generic programming knowledge
- Routine task steps that were just following the spec
- Temporary or task-specific implementation details
- Anything obvious from the code or docs

## Step 3 — Save each memory

For each item that passes the filter, call the \`memory\` CLI tool:

\`\`\`bash
memory store --content "<concise description>" --category "<category>" --tags "<tag1,tag2>"
\`\`\`

Categories:
- \`conventions\` — naming, formatting, structural patterns
- \`technical\` — architecture, library decisions, algorithms, tooling
- \`business\` — product requirements, client preferences, domain rules
- \`others\` — anything that doesn't fit above

Tags: 2–4 lowercase words describing the topic (e.g. \`typescript,sqlite,testing\`).

Keep content concise but complete. Write it so a future agent reading it cold understands both the fact AND why it matters.

**If the \`memory\` command is not found**: Report that the tool is not installed and provide the install command: \`npm install -g agent-memory\` or \`npm link\` from the project root.

## Step 4 — Report

After saving, output a brief summary:
- How many memories were saved
- List each one: category, first 80 chars of content
- Any that were skipped and why (one line)

If nothing was worth saving, say so clearly — that's a valid outcome.`;

  // Track which sessions we've already run the end-of-session memory prompt for
  // to prevent infinite loops when the session goes idle again.
  const processedSessions = new Set();

  return {
    'experimental.session.compacting': async (input, output) => {
      // Inject the memory prompt into the compaction context so the AI
      // processes learnings when context window limits are reached.
      output.context.push(`## Memory Extraction Task\n${MEMORY_PROMPT}`);
    },

    event: async ({ event }) => {
      // Execute the memory prompt when the session goes idle (end of task)
      if (event.type === 'session.idle') {
        const sessionId = event.session?.id || event.properties?.sessionId;

        if (sessionId && !processedSessions.has(sessionId)) {
          processedSessions.add(sessionId);

          try {
            await client.session.prompt({
              path: { id: sessionId },
              body: {
                parts: [{ type: 'text', text: MEMORY_PROMPT }],
              },
            });
          } catch (error) {
            console.error(
              'Failed to trigger memory prompt on session idle:',
              error,
            );
          }
        }
      }
    },
  };
};
