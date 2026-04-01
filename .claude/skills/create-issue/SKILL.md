---
name: create-issue
description: Create a well-formatted GitHub issue for this project using the team's feature request or bug report template.
---

## When to use this skill

Use this skill whenever a new task, feature, bug, or chore needs a GitHub issue before work begins. All work in this project **must** have a corresponding issue. Invoke this skill before starting implementation.

---

## Issue format

Every issue must use one of the two templates below. Choose based on what the user is describing:

- **Feature request** — new functionality, enhancement, or page
- **Bug report** — something is broken or behaving incorrectly

---

### Feature request template

```
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

### Bug report template

```
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Additional context**
Add any other context about the problem here.
```

---

## Step-by-step process

### Step 1 — Determine issue type and gather details

Ask yourself (or the user) the following before writing the issue:

- Is this a **feature** (new behaviour wanted) or a **bug** (existing behaviour broken)?
- What is the **title**? Keep it concise: `feat: ...`, `fix: ...`, or `test: ...`.
- What **label** applies? Common labels: `enhancement`, `bug`, `test`.
- Does this issue **depend on** or **block** other issues? If so, note them in Additional context.

### Step 2 — Write the issue body

Fill out the appropriate template fully. Do not leave any section blank — write "N/A" only if a section genuinely does not apply. Be specific:

- Problem/bug description should explain the *impact* on the user, not just the symptom.
- Solution description should list concrete deliverables (endpoints, UI elements, behaviour changes).
- Alternatives should show you have considered trade-offs.
- Additional context should include issue dependencies, affected files, or relevant constraints.

### Step 3 — Create the issue with `gh`

```bash
gh issue create \
  --title "<title>" \
  --label "<label>" \
  --body "<body>"
```

Always pass the body via a heredoc or a variable to preserve newlines:

```bash
gh issue create --title "feat: My feature" --label "enhancement" --body "$(cat <<'EOF'
**Is your feature request related to a problem? Please describe.**
...

**Describe the solution you'd like**
...

**Describe alternatives you've considered**
...

**Additional context**
...
EOF
)"
```

### Step 4 — Confirm and return the issue URL

After creation, return the issue URL to the user so they can reference it in commits and pull requests.

---

## Checklist before finishing

- [ ] Title follows `feat:`, `fix:`, or `test:` convention
- [ ] Correct template used (feature request vs bug report)
- [ ] No section left blank without justification
- [ ] Dependencies on other issues noted in Additional context
- [ ] Issue created with `gh issue create` and URL returned to user
