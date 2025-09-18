# Tasks Template

## Task Generation Rules

### Task Types
- **Setup tasks**: Project initialization, dependencies, configuration
- **Test tasks [P]**: Contract tests, integration tests, unit tests
- **Core tasks**: Entity creation, service implementation, CLI commands
- **Integration tasks**: Database connections, middleware, logging
- **Polish tasks [P]**: Performance optimization, documentation, final testing

### Parallel Execution
- [P] = Can run in parallel with other [P] tasks
- Tasks without [P] = Sequential execution required
- Different files = Can be parallel [P]
- Same file = Sequential (no [P])

### Task Dependencies
1. Setup before everything
2. Tests before implementation (TDD)
3. Models before services
4. Services before endpoints
5. Core before integration
6. Everything before polish

### File Organization
- Keep source files small (< 200 lines)
- Use composition over inheritance
- Separate concerns into focused modules
- One responsibility per file
- Clear interfaces between modules

## Task Format

### TXXX: Task Name
**Type**: [Setup|Test|Core|Integration|Polish]  
**Priority**: [Critical|High|Medium|Low]  
**Effort**: [X days|X hours]  
**Dependencies**: [TXXX, TYYY]  
**Parallel**: [P] (if applicable)

**Description**: Brief task description

**Acceptance Criteria**:
- [ ] Specific deliverable 1
- [ ] Specific deliverable 2
- [ ] Specific deliverable 3

**Files to Create/Modify**:
- `path/to/file1.ts`
- `path/to/file2.ts`
- `tests/path/to/test1.test.ts`

**Technical Tasks**:
- [ ] Specific technical task 1
- [ ] Specific technical task 2
- [ ] Specific technical task 3

## Parallel Execution Examples

### Example 1: Contract Tests
```bash
# These can run in parallel
Task agent execute T005  # Domain contract tests
Task agent execute T006  # Application contract tests
Task agent execute T007  # Infrastructure contract tests
```

### Example 2: Entity Implementation
```bash
# These can run in parallel
Task agent execute T015  # ResearchStudy entity
Task agent execute T016  # ResearchQuestion entity
Task agent execute T017  # ResearchSource entity
```

### Example 3: Service Implementation
```bash
# These can run in parallel
Task agent execute T025  # StudyService
Task agent execute T026  # QuestionService
Task agent execute T027  # SourceService
```