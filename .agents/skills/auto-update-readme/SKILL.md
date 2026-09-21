---
name: auto-update-readme
description: >-
  Use this skill whenever routes, models, controllers, middleware, environment variables, or scripts are created, updated, or removed. Keeps README.md automatically synchronized with codebase changes.
---

# Auto-Update README Skill

This skill guarantees that `README.md` is updated alongside code modifications.

## Trigger Conditions
Activate this workflow whenever any of the following occur:
- New API routes or endpoints are created or modified in `src/Routes/`.
- New controllers or request handlers are added in `src/controllers/`.
- Database models or schemas change in `src/models/`.
- New environment variables are added to `.env`.
- NPM packages or scripts are changed in `package.json`.

## Instructions
1. Inspect the affected files to understand signature/contract changes (e.g. endpoint paths, HTTP methods, required parameters, auth requirements).
2. Check [README.md](file:///c:/Users/yella/Desktop/Backend-ledger-project/README.md) sections:
   - **Features**: Update feature list if new capabilities were added.
   - **API Documentation**: Update route endpoints, methods, descriptions, and auth headers.
   - **Environment Variables**: Add new required `.env` keys.
   - **Project Structure**: Update tree diagram if new modules/directories were created.
3. Modify [README.md](file:///c:/Users/yella/Desktop/Backend-ledger-project/README.md) using `replace_file_content`.
