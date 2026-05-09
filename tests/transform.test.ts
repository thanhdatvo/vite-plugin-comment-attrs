import { describe, expect, it } from "vitest";
import { commentAttrsPlugin } from "../src/index";

function transform(
  code: string,
  options: Parameters<typeof commentAttrsPlugin>[0] = {},
  id = "/src/App.tsx",
) {
  const plugin = commentAttrsPlugin(options);

  if (typeof plugin.transform !== "function") {
    throw new Error("plugin.transform is not a function");
  }

  const result = plugin.transform.call({} as never, code, id);

  if (!result) {
    return null;
  }

  if (typeof result === "string") {
    return result;
  }

  if (result instanceof Promise) {
    throw new Error("Expected sync transform but got Promise");
  }

  return result.code;
}

describe("commentAttrsPlugin", () => {
  it("adds a class attribute from a JSX comment", () => {
    const input = `
function App() {
  return (
    <div>
      {/* @class rounded-lg bg-blue-500 */}
      <h1>Hello</h1>
    </div>
  );
}
`;

    const output = transform(input);

    expect(output).toContain('<h1 class="rounded-lg bg-blue-500">Hello</h1>');
    expect(output).not.toContain("@class rounded-lg bg-blue-500");
  });

  it("appends multiple class comments", () => {
    const input = `
function App() {
  return (
    <div>
      {/* @class rounded-lg bg-blue-500 */}
      {/* @class px-4 py-2 text-white */}
      <h1>Hello</h1>
    </div>
  );
}
`;

    const output = transform(input);

    expect(output).toContain(
      '<h1 class="rounded-lg bg-blue-500 px-4 py-2 text-white">Hello</h1>',
    );
  });

  it("appends to an existing class attribute", () => {
    const input = `
function App() {
  return (
    <div>
      {/* @class rounded-lg */}
      <h1 class="title">Hello</h1>
    </div>
  );
}
`;

    const output = transform(input);

    expect(output).toContain('<h1 class="title rounded-lg">Hello</h1>');
  });

  it("supports replace strategy for id", () => {
    const input = `
function App() {
  return (
    <div>
      {/* @id first-id */}
      {/* @id final-id */}
      <h1 id="old-id">Hello</h1>
    </div>
  );
}
`;

    const output = transform(input, {
      directives: {
        "@id": { attr: "id", merge: "replace" },
      },
    });

    expect(output).toContain('<h1 id="final-id">Hello</h1>');
    expect(output).not.toContain("old-id");
    expect(output).not.toContain("first-id");
  });

  it("supports multiple configured directives", () => {
    const input = `
function App() {
  return (
    <div>
      {/* @class rounded-lg */}
      {/* @id title */}
      {/* @title Greeting */}
      <h1>Hello</h1>
    </div>
  );
}
`;

    const output = transform(input, {
      directives: {
        "@class": { attr: "class", merge: "append" },
        "@id": { attr: "id", merge: "replace" },
        "@title": { attr: "title", merge: "replace" },
      },
    });

    expect(output).toContain(
      '<h1 class="rounded-lg" id="title" title="Greeting">Hello</h1>',
    );
  });

  it("works inside JSX fragments", () => {
    const input = `
function App() {
  return (
    <>
      {/* @class text-white */}
      <h1>Hello</h1>
    </>
  );
}
`;

    const output = transform(input);

    expect(output).toContain('<h1 class="text-white">Hello</h1>');
  });

  it("supports line comments attached as leading comments", () => {
    const input = `
function App() {
  return (
    // @class text-white
    <h1>Hello</h1>
  );
}
`;

    const output = transform(input);

    expect(output).toContain('<h1 class="text-white">Hello</h1>');
  });

  it("returns null when no directive exists", () => {
    const input = `
function App() {
  return <h1>Hello</h1>;
}
`;

    const output = transform(input);

    expect(output).toBeNull();
  });

  it("returns null for non-target files", () => {
    const input = `
/* @class text-white */
body {}
`;

    const output = transform(input, {}, "/src/style.css");

    expect(output).toBeNull();
  });

  it("supports React className via config", () => {
    const input = `
function App() {
  return (
    <div>
      {/* @class rounded-lg */}
      <h1 className="title">Hello</h1>
    </div>
  );
}
`;

    const output = transform(input, {
      directives: {
        "@class": { attr: "className", merge: "append" },
      },
    });

    expect(output).toContain('<h1 className="title rounded-lg">Hello</h1>');
  });
});
