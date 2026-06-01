# Project Coding Conventions

## General

- All functions must have JSDoc comments describing parameters and return values.
- Maximum function length: 40 lines. Extract helpers for longer logic.
- No magic numbers — use named constants.
- Prefer `const` over `let`; never use `var`.

## Naming

- Variables and functions: `camelCase`
- Classes and React components: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: `kebab-case.js` for utilities, `PascalCase.jsx` for components

## Error Handling

- Always use `try/catch` in async functions.
- Never swallow errors silently — log or re-throw with context.
- Use structured error objects: `{ code, message, context }`.
- Return `{ data, error }` tuples from service functions instead of throwing.

## Security

- Never hard-code secrets, API keys, or passwords. Use environment variables.
- Sanitize and validate all user input before use.
- Use parameterized queries — never string-concatenate SQL.
- Set appropriate CORS origins; never use wildcard `*` in production.
- Hash passwords with bcrypt (cost factor ≥ 12); never store plain text.

## API Design

- REST routes: `GET /resource`, `POST /resource`, `PUT /resource/:id`, `DELETE /resource/:id`
- Always return JSON with a consistent shape: `{ data, error, meta }`.
- Use HTTP status codes correctly: 200/201 success, 400 bad request, 401 unauthorized, 404 not found, 500 server error.
- Validate request bodies with a schema library (e.g., Zod).

## Performance

- Avoid nested loops on large datasets — prefer `Map` or `Set` for O(1) lookups.
- Debounce user-triggered API calls (≥ 300 ms).
- Memoize expensive React computations with `useMemo` / `useCallback`.
- Paginate API responses; never return unbounded lists.

## Testing

- Each module must have a corresponding `*.test.js` file.
- Unit tests should not call external services — mock all I/O.
- Aim for ≥ 80% branch coverage on business-logic modules.

## React

- Functional components only — no class components.
- Co-locate component styles, hooks, and tests in the same folder.
- Lift state only as high as necessary.
- Avoid prop-drilling more than two levels — use Context or a state manager.
- Always provide `key` props on list items (never use array index as key).

## Python (if applicable)

- Follow PEP 8 style guidelines.
- Use type hints on all function signatures.
- Prefer list comprehensions over `for` loops for simple transformations.
- Use `is None` / `is not None` instead of `== None`.
- Avoid bare `except` clauses — always catch specific exception types.
