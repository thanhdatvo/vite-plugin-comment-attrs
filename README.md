# vite-plugin-comment-attrs

Transform JSX comments into JSX attributes.

## Why use this plugin?

This plugin is mainly useful for two workflows:

### 1. Shorten JSX syntax

Long attribute values can make JSX harder to scan, especially when using utility-first CSS frameworks.
Instead of writing:

```tsx
<h1 class="rounded-lg bg-blue-500 px-4 py-2 text-white">Hello Mom</h1>
```

You can move the long attribute value above the element:

```tsx
{/* @class rounded-lg bg-blue-500 */}
{/* @class px-4 py-2 text-white */}
<h1>Hello Mom</h1>;
```

This keeps the JSX element itself smaller and easier to read.

### 2. Try new attribute values during development

You can experiment with new attribute values without directly changing the original attribute.

For example:

```tsx
{/* @class rounded-lg bg-blue-500 */}
<h1 class="title">Hello Mom</h1>;
```

Output:

```tsx
<h1 class="title rounded-lg bg-blue-500">Hello Mom</h1>
```

This is useful when you want to test new classes, IDs, labels, or other attributes while keeping the original JSX mostly unchanged.

---

## Try it online

- <a href="https://stackblitz.com/github/thanhdatvo/vite-plugin-comment-attrs/tree/main/examples/react" target="_blank" rel="noopener noreferrer">React playground</a>
- <a href="https://stackblitz.com/github/thanhdatvo/vite-plugin-comment-attrs/tree/main/examples/solid" target="_blank" rel="noopener noreferrer">Solid playground</a>

---

## Merge strategies

### Append

Appends to the existing attribute value.

Input

```tsx
{/* @class rounded-lg */}
<h1 class="title">Hello</h1>;
```

Output

```tsx
<h1 class="title rounded-lg">Hello</h1>
```

This is useful for attributes like `class` where you want to add additional classes without removing existing ones.

### Replace

Replaces existing value. Last directive wins.

Input

```tsx
{/* @id first */}
{/* @id final */}
<h1 id="old">Hello</h1>;
```

Output:

```tsx
<h1 id="final">Hello</h1>
```

---

## Usage

### Install

```bash
npm install -D vite-plugin-comment-attrs
```

### Configuration

```tsx
commentAttrsPlugin({
  directives: {
    "@class": { attr: "class", merge: "append" },
    "@id": { attr: "id", merge: "replace" },
    "@alt": { attr: "alt", merge: "replace" },
    "@title": { attr: "title", merge: "replace" },
    "@ariaLabel": { attr: "aria-label", merge: "replace" },
  },
});
```

#### Plugin order

Place `commentAttrsPlugin` before the framework plugin (e.g., `react()` or `solid()`) to
allows the comment attributes to be transformed before JSX being processed.

```tsx
plugins: [commentAttrsPlugin(), solid()];
```

```tsx
plugins: [commentAttrsPlugin(), react()];
```

#### ReactJS example

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { commentAttrsPlugin } from "vite-plugin-comment-attrs";

export default defineConfig({
  plugins: [
    commentAttrsPlugin({
      directives: {
        "@class": { attr: "className", merge: "append" },
        "@id": { attr: "id", merge: "replace" },
        "@alt": { attr: "alt", merge: "replace" },
      },
    }),
    react(),
  ],
});
```

#### SolidJS example

```ts
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { commentAttrsPlugin } from "vite-plugin-comment-attrs";

export default defineConfig({
  plugins: [
    commentAttrsPlugin({
      directives: {
        "@class": { attr: "class", merge: "append" },
        "@id": { attr: "id", merge: "replace" },
        "@alt": { attr: "alt", merge: "replace" },
      },
    }),
    solid(),
  ],
});
```

---

## Notes

### 1. Supported file types

- This plugin only processes JSX/TSX/JS/TS files.
- Use JSX comments:

```tsx
{/* @class rounded-lg */}
<h1>Hello</h1>;
```

- Babel comments

```tsx
// @class rounded-lg
<h1>Hello</h1>
```

### 2. Framework-specific attribute mappings

- SolidJS uses `class`, so map `@class` to `class`.
- ReactJS uses `className`, so map `@class` to `className`.

---

## Contributing

Contributions are welcome!
If you find a bug, have an idea, or want to improve the plugin,
feel free to open an issue or submit a pull request.

- Clone the repository

```sh
git clone https://github.com/thanhdatvo/vite-plugin-comment-attrs.git
cd vite-plugin-comment-attrs
```

- Install dependencies, run test and build the package

```sh
bun install
bun test
bun run build
```

---

## Author

Created by Thanh Dat Vo

## AI usage disclosure

AI tools was used as a part of the development process for this project.
It helped with implementation, documentation, and testing.
The final design decisions, validation, and publishing responsibility remain with the maintainer.
I believe the usefulness and impact of the project matter more than the specific tools used in its creation.

## License

MIT © 2026 Thanh Dat Vo
