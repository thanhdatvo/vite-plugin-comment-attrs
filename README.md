# vite-plugin-comment-attrs

Transform JSX comments into JSX attributes.

## At a glance
```tsx
{/* @class rounded-lg bg-blue-500 */}
{/* @class px-4 py-2 text-white */}
{/* @id title */}
<h1>Hello Mom</h1>
```

Output
```tsx
<h1 class="rounded-lg bg-blue-500 px-4 py-2 text-white" id="title">
  Hello Mom
</h1>
```

## Merge strategies
### Append
Appends to the existing attribute value. 
```tsx
{/* @class rounded-lg */}
<h1 class="title">Hello</h1>
```

Output
```tsx
<h1 class="title rounded-lg">Hello</h1>
```

This is useful for attributes like `class` where you want to add additional classes without removing existing ones.

### Replace
Replaces existing value. Latest directive wins:
```tsx
{/* @id first */}
{/* @id final */}
<h1 id="old">Hello</h1>
```


Output:
```tsx
<h1 id="final">Hello</h1>
```

## Install

```bash
npm install -D vite-plugin-comment-attrs


## ReactJs

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
        "@alt": { attr: "alt", merge: "replace" }
      }
    }),
    solid()
  ]
});
```

## SolidJS

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
        "@alt": { attr: "alt", merge: "replace" }
      }
    }),
    solid()
  ]
});
```
