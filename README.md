# AI Section Generator & Editor

Type a prompt like `a pricing section with 3 tiers`, get a rendered section, edit the text
directly on the page and save it back.

The backend never returns HTML. It returns a nested JSON tree describing the UI, and the
React renderer walks that tree.

## Running it

Node 18.17+, two terminals.

```bash
cd server && npm install && npm run dev     # http://localhost:4000
cd client && npm install && npm run dev     # http://localhost:5173
```

Vite proxies `/api` to the server, so there is nothing to configure.
Backend tests: `cd server && npm test`.

## Prompts

| Prompt | Result |
| --- | --- |
| `a pricing section with 3 tiers` | pricing, 3 tiers |
| `pricing section with 7 plans` | pricing, 7 tiers |
| `pricing with two tiers` | pricing, 2 tiers (words work too) |
| `a hero section` | hero, 3 highlights |
| `pricing with 40 tiers` | capped at 8, and the status line says so |
| no keyword | pricing (default), and the status line says so |

The count is read from the prompt instead of being hardcoded, so one generator covers
1 to 8 tiers, and it is clamped so a silly number cannot break the layout.

## Structure

```
server/src
  config.js            limits and allowed node types, shared by parser and validator
  sectionService.js    generate / get / save, plus the layout -> generator map
  routes.js            three endpoints
  generators/          pricing.js, hero.js
  lib/                 promptParser, validateTree, node helpers, HttpError
  store/sections.js    in-memory storage (only file that knows how data is kept)

client/src
  hooks/useSectionBuilder.js   tree state, unsaved flag, generate/save
  lib/tree.js                  immutable text update
  renderer/                    NodeRenderer (recursive), nodes.jsx (type -> component), EditableText
  components/                  Toolbar, Canvas
```

Every node is `{ id, type, props, children }`. Ids are unique inside a tree, so editing a
piece of text is a lookup by id rather than a path walk.

## API

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| POST | `/api/sections/generate` | `{ prompt }` | `{ id, tree, meta, version }` |
| GET | `/api/sections/:id` | – | `{ id, tree, meta, version, updatedAt }` |
| PUT | `/api/sections/:id` | `{ tree }` | `{ id, version, updatedAt }` |

## Notes on a few choices

- The renderer uses a type-to-component map, not a switch. A new node type is one component
  plus one line, and nothing existing changes. Unknown types render a placeholder instead of
  blanking the page.
- `NodeRenderer` renders children and passes them down, so node components never import the
  renderer back.
- Inline editing uses uncontrolled `contentEditable`; a controlled one moves the caret to the
  start on every keystroke. The value goes into the tree on blur, Enter commits, Escape reverts.
- Text updates are immutable and untouched branches keep their object identity.
- Save validates the tree server-side (types, duplicate ids, depth, size) and returns all
  problems at once.

With more time: a real database with version history, optimistic concurrency on save, an
actual LLM behind the generator returning the same JSON contract, and add/remove/reorder of
nodes rather than text-only editing.


LIVE PREVIEW: https://section-builder-mu.vercel.app/
