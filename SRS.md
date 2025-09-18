# Software Requirements Specification (SRS)

**System Name:** UX-Kit
**Prepared by:** Khaos Inc
**Date:** YYYY-MM-DD
**Version:** 0.1

---

## 1. Introduction

### 1.1 Purpose

The purpose of UX-Kit is to provide a **spec-driven, command-line toolkit for UX research**. It enables researchers to move from questions to insights through a series of structured AI-assisted steps. The toolkit standardizes how research artifacts (questions, sources, summaries, interviews, syntheses) are captured, stored, and version-controlled, making the research process **transparent, repeatable, and extensible**.

### 1.2 Scope

UX-Kit is a CLI package intended for **macOS/Linux (bash/zsh shells)**. It integrates with AI coding/research assistants (initially Cursor, with future expansion to Codex CLI and others). It creates a `.uxkit/` directory within a project to manage research artifacts. Each research effort is structured into phases with custom slash commands:

* `/research:questions` – define research questions.
* `/research:sources` – gather and log sources.
* `/research:summarize` – summarize documents.
* `/research:interview` – structure interview transcripts.
* `/research:synthesize` – cluster insights and output findings.

UX-Kit is designed to be **deployable, agent-agnostic, and extensible**, suitable for integration into IDEs or standalone shell usage.

### 1.3 Definitions, Acronyms, and Abbreviations

* **AI Agent**: An AI-powered coding or research assistant (e.g., Cursor).
* **Artifact**: A structured research document (Markdown) produced during a phase.
* **Research Study**: A scoped UX research effort stored under `.uxkit/studies/`.

### 1.4 References

* GitHub open-source experiments in spec-driven development (for workflow inspiration).
* IEEE SRS standard outline.

---

## 2. Overall Description

### 2.1 Product Perspective

UX-Kit functions as a **command-layer** between human researchers and AI assistants. It orchestrates AI prompting, enforces workflow structure, and manages persistence of research outputs.

### 2.2 Product Functions

* Initialize `.uxkit/` directory with templates, scripts, and config.
* Provide slash commands to trigger research steps.
* Maintain research artifacts in structured directories.
* Support multiple concurrent research studies.
* Facilitate review and refinement of outputs at each stage.

### 2.3 User Characteristics

* UX Researchers, Product Managers, Designers, or Engineers.
* Comfortable using CLI tools and version control.
* Working in research-driven product teams.

### 2.4 Constraints

* Target shell: Bash/zsh (macOS/Linux).
* AI agent integration: Cursor at launch.
* File format: Markdown (primary).
* No native Windows support initially (WSL recommended).

### 2.5 Assumptions and Dependencies

* Assumes user has access to an AI agent that supports slash commands.
* Depends on file system access for creating `.uxkit/` directories.
* Assumes Git or similar VCS is used for artifact tracking (optional but encouraged).

---

## 3. System Features

### 3.1 Command: `/research:questions`

**Description:** Generates `questions.md` capturing research objectives and questions.
**Inputs:** User prompt (topic/goal).
**Outputs:** Markdown file under `.uxkit/studies/<id>/questions.md`.
**Constraints:** Requires `.uxkit/` initialized.

### 3.2 Command: `/research:sources`

**Description:** Discovers and logs source documents.
**Inputs:** User prompt or system suggestion from questions.
**Outputs:** `.uxkit/studies/<id>/sources.md`.
**Constraints:** Requires questions.md exists.

### 3.3 Command: `/research:summarize`

**Description:** Produces summaries for source documents.
**Inputs:** File path or reference to source.
**Outputs:** `.uxkit/studies/<id>/summaries/*.md`.
**Constraints:** Requires sources.md exists.

### 3.4 Command: `/research:interview`

**Description:** Formats interview transcripts into structured notes.
**Inputs:** Transcript text or file.
**Outputs:** `.uxkit/studies/<id>/interviews/*.md`.
**Constraints:** Must specify participant/file.

### 3.5 Command: `/research:synthesize`

**Description:** Clusters insights and produces prioritized findings.
**Inputs:** All previous artifacts.
**Outputs:** `.uxkit/studies/<id>/insights.md`.
**Constraints:** Requires summaries/interviews completed.

---

## 4. External Interface Requirements

### 4.1 User Interfaces

* CLI commands (`uxkit init`, `/research:...`).
* IDE slash commands (Cursor integration).

### 4.2 Hardware Interfaces

* Unix-like shell environment.

### 4.3 Software Interfaces

* AI agent CLI/IDE (Cursor, Codex CLI).
* Git (optional, for artifact versioning).

### 4.4 Communications Interfaces

* Local file system operations.
* Optional: API requests to AI agent.

---

## 5. System Architecture & Directory Layout

```
.uxkit/
 ├── memory/                 # persistent context (principles, ethics)
 │    └── principles.md
 ├── templates/              # Markdown templates for each command
 │    ├── questions-template.md
 │    ├── sources-template.md
 │    ├── summarize-template.md
 │    ├── interview-template.md
 │    └── synthesis-template.md
 ├── scripts/                # Bash scripts implementing commands
 │    ├── create-new-research.sh
 │    ├── setup-sources.sh
 │    ├── summarize-source.sh
 │    ├── format-interview.sh
 │    └── synthesize-insights.sh
 └── studies/
      └── 001-onboarding/
           ├── questions.md
           ├── sources.md
           ├── summaries/
           ├── interviews/
           └── insights.md
```

---

## 6. Nonfunctional Requirements

* **Reliability:** Each command must fail gracefully (e.g., warn if prerequisites missing).
* **Usability:** Clear CLI help and documentation for each command.
* **Performance:** Commands execute in <2s for setup; AI call latency depends on agent.
* **Portability:** Runs on macOS and Linux; WSL fallback for Windows.
* **Scalability:** Can handle multiple research studies in parallel.

---

## 7. Future Enhancements

* Agent expansion: Codex CLI, VS Code, Windsurf, Qwen.
* Multi-modal support: Audio/video interview processing.
* Export formats: HTML or PDF reports.
* Team collaboration: Shared `.uxkit/` syncing across repos.

---

## 8. Appendices

### A. Glossary

* **Study ID:** Numeric prefix for each research study (001, 002…).
* **Artifact:** Output file generated by a command.

### B. Example Workflow

1. `uxkit init --ai cursor`
2. `/research:questions Improve onboarding retention`
3. `/research:sources`
4. `/research:summarize analytics.csv`
5. `/research:interview transcript_user1.txt`
6. `/research:synthesize`