---
description: Implement specific tasks using TDD approach with web search support and automatic task tracking updates.
---

Given the task numbers provided as arguments, do this:

1. **Parse Task Numbers**: Extract task identifiers (e.g., T0001, T002, T021) from the arguments. If no specific tasks are mentioned, search the current tasks.md file for the next task to be started (marked as "Next Up" or first incomplete task). Note: Tasks with trailing [P] can be performed in parallel. When there is a sequence of these you can queue in batches.

2. **Load Task Details**: 
   - Read the tasks.md file from `.specify/plans/**/tasks.md`
   - Extract full task details including:
     - Description and implementation details
     - File paths to be created/modified
     - Dependencies and acceptance criteria
     - Priority and effort estimates

3. **Verify Dependencies**: Check that all task dependencies are completed before proceeding. If dependencies are missing, report which tasks need to be completed first.

4. **Implement Using TDD Approach**:
   - **Use Case Tests First**: Write comprehensive use case tests that define the expected behavior and user scenarios before writing any implementation code
   - **Red Phase**: Write failing use case tests that capture the complete user journey and expected outcomes
   - **Green Phase**: Implement minimal code to make use case tests pass
   - **Refactor Phase**: Improve code while keeping all tests green
   - **Never hesitate to use web search for guidance or clarification on implementation or issues**
   - **Track Effort**:  Keep track of time spent on each task as well as actual size vs predicted and update the tasks.md file accordingly

5. **Web Search Integration**: 
   - Use web search when encountering implementation challenges
   - Search for best practices, examples, or solutions to specific problems
   - Look up documentation for libraries, frameworks, or APIs being used
   - Research error messages or debugging approaches

6. **Implementation Process**:
   - **Step 1**: Write comprehensive use case tests that define the expected behavior
   - **Step 2**: Run tests to confirm they fail (Red phase)
   - **Step 3**: Implement minimal code to make use case tests pass (Green phase)
   - **Step 4**: Add unit tests for individual components
   - **Step 5**: Refactor and improve code while keeping all tests green
   - Follow the exact file paths specified in the task
   - Implement all acceptance criteria
   - Ensure code quality and best practices
   - Add proper error handling and validation
   - Include comprehensive documentation and comments

7. **File Size Compliance**:
   - **CRITICAL**: Always prefer small source and test files as per project constitution
   - Keep source files under 1000 lines (1000 lines is considered Code Smell)
   - Keep test files small and focused
   - Split large files into smaller, focused modules
   - Each file should have a single, clear responsibility
   - Use composition over large monolithic files

8. **Update Task Status**: 
   - Mark the completed task(s) as "✅ COMPLETED" in the tasks.md file
   - Update the progress tracking section
   - Update the "Next Up" task if applicable
   - Add completion timestamp and any notes about implementation (use Terminal to get current date and time)

9. **Commit Changes**: 
   - Stage all modified and new files
   - Create a descriptive commit message following the format: "feat: implement T{number} - {task description}"
   - Include details about what was implemented and any notable decisions

10. **Report Results**: 
    - Summarize what was implemented
    - Report any issues encountered and how they were resolved
    - Note any web searches performed and their outcomes
    - Confirm all acceptance criteria were met

**TDD Implementation Guidelines**:
- **CRITICAL**: Always write use case tests first, before any implementation code
- Use case tests should capture complete user scenarios and expected outcomes
- Make use case tests specific and comprehensive - they define the contract
- Use descriptive test names that explain the user journey and expected behavior
- Ensure use case tests are isolated and can run independently
- Write unit tests only after use case tests are passing
- Refactor code regularly while keeping all tests green
- Aim for high test coverage (ideally >90%) with use case tests as the foundation

**Use Case Test Structure**:
- **Given**: Set up the initial state and context
- **When**: Perform the action or trigger the behavior
- **Then**: Verify the expected outcome and side effects
- **Example**: "Given a user with valid credentials, when they request a chat session, then they should receive a session ID and be able to send messages"
- **Coverage**: Test happy path, error cases, edge cases, and boundary conditions
- **Integration**: Test the complete flow from user input to system response

**File Organization Strategy**:
- **Small Files**: Keep source files under 1000 lines (constitution requirement)
- **Single Responsibility**: Each file should have one clear purpose
- **Logical Splitting**: Split by functionality, not just size
- **Test Files**: Keep test files small and focused on specific scenarios
- **Module Structure**: Use composition over large monolithic files
- **Examples**:
  - Split large services into smaller, focused modules
  - Separate API endpoints into individual files
  - Create focused test files for specific use cases
  - Use helper/utility files for common functionality

**Web Search Usage**:
- Search for implementation patterns and best practices
- Look up API documentation and examples
- Research error solutions and debugging approaches
- Find community discussions about similar challenges
- Verify current best practices for the technologies being used

**Task Completion Criteria**:
- All acceptance criteria met
- All tests passing
- Code follows project standards
- Documentation updated
- Task marked as completed in tasks.md
- Changes committed to git

Context for implementation: $ARGUMENTS

The implementation should be thorough, well-tested, and ready for production use. Never skip the TDD approach or web search when encountering challenges.