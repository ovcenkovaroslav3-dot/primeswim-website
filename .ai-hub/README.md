# PRIME SWIM AI Hub

Purpose: create a controlled workflow where the owner gives one task, an AI architect converts it into an implementation brief, Claude Code performs the implementation, GitHub stores the work, and an AI reviewer checks the result before production.

## Workflow

1. User request
2. Architect turns request into a structured task
3. Developer (Claude Code) works only in a task branch
4. Automated checks run
5. Reviewer validates the diff against acceptance criteria
6. Developer fixes review findings when needed
7. Pull request is presented for approval
8. Production deployment remains manual until the workflow is proven safe

## Safety rules

- Never push directly to production branches.
- Never modify DNS, payments, secrets, customer data, CRM data, or production infrastructure without explicit approval.
- Never expose API keys in commits, logs, issues, or pull requests.
- Maximum automatic developer-review cycles: 3.
- Stop and escalate if requirements conflict or tests remain failing after 3 cycles.

## Initial roles

- Architect: task decomposition and acceptance criteria
- Developer: Claude Code implementation
- Reviewer: independent code and requirement review
- Tester: automated validation

## Task contract

Every implementation task must contain:

- project
- goal
- scope
- files/areas allowed to change
- acceptance criteria
- tests required
- risk level
- forbidden actions

The first pilot project is PRIME SWIM website.