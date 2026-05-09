import type { Plugin } from "vite";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import type { NodePath } from "@babel/traverse";
import generateModule from "@babel/generator";
import * as t from "@babel/types";

function interopDefault<T extends object>(module: T | { default: T }): T {
  return "default" in module ? module.default : module;
}

const traverse = interopDefault(traverseModule);
const generate = interopDefault(generateModule);

export type MergeStrategy = "append" | "replace";

export type DirectiveRule = {
  attr: string;
  merge: MergeStrategy;
};

export type DirectiveConfig = Record<string, DirectiveRule>;

export type CommentAttrsPluginOptions = {
  directives?: DirectiveConfig;
  include?: RegExp;
  exclude?: RegExp;
};

type ParsedDirective = {
  directive: string;
  attrName: string;
  merge: MergeStrategy;
  value: string;
};

type CollectedAttr = {
  merge: MergeStrategy;
  values: string[];
};

const DEFAULT_DIRECTIVES: DirectiveConfig = {
  "@class": { attr: "class", merge: "append" },
};

function isTargetFile(id: string, options: CommentAttrsPluginOptions) {
  const cleanId = id.split("?")[0];

  if (options.exclude?.test(cleanId)) {
    return false;
  }

  if (options.include) {
    return options.include.test(cleanId);
  }

  return /\.(jsx|tsx|js|ts)$/.test(cleanId);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function codeContainsAnyDirective(code: string, directives: DirectiveConfig) {
  return Object.keys(directives).some((directive) => code.includes(directive));
}

function isWhitespaceJsxText(node: t.Node): boolean {
  return t.isJSXText(node) && node.value.trim() === "";
}

function getJsxAttribute(openingElement: t.JSXOpeningElement, name: string) {
  return openingElement.attributes.find((attr) => {
    return t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name, { name });
  }) as t.JSXAttribute | undefined;
}

function getCommentTextsFromJsxNode(node: t.Node): string[] {
  if (!t.isJSXExpressionContainer(node)) {
    return [];
  }

  const texts: string[] = [];

  if (t.isJSXEmptyExpression(node.expression)) {
    texts.push(
      ...(node.expression.innerComments ?? []).map((comment) => comment.value),
    );
  }

  texts.push(...(node.innerComments ?? []).map((comment) => comment.value));
  texts.push(...(node.leadingComments ?? []).map((comment) => comment.value));
  texts.push(...(node.trailingComments ?? []).map((comment) => comment.value));

  return texts;
}

function parseDirectiveText(
  text: string,
  directives: DirectiveConfig,
): ParsedDirective | null {
  const trimmed = text.trim();

  for (const [directive, rule] of Object.entries(directives)) {
    const escapedDirective = escapeRegExp(directive);
    const match = trimmed.match(new RegExp(`^${escapedDirective}\\s+(.+)$`));

    if (!match) {
      continue;
    }

    return {
      directive,
      attrName: rule.attr,
      merge: rule.merge,
      value: match[1].trim(),
    };
  }

  return null;
}

function getJsxDirectiveValue(
  node: t.Node,
  directives: DirectiveConfig,
): ParsedDirective | null {
  for (const text of getCommentTextsFromJsxNode(node)) {
    const parsed = parseDirectiveText(text, directives);

    if (parsed) {
      return parsed;
    }
  }

  return null;
}

function addCollectedAttr(
  attrs: Map<string, CollectedAttr>,
  parsed: ParsedDirective,
) {
  const existing = attrs.get(parsed.attrName);

  if (!existing) {
    attrs.set(parsed.attrName, {
      merge: parsed.merge,
      values: [parsed.value],
    });
    return;
  }

  if (parsed.merge === "append") {
    existing.merge = "append";
    existing.values.push(parsed.value);
    return;
  }

  existing.merge = "replace";
  existing.values = [parsed.value];
}

function setOrMergeAttribute(
  openingElement: t.JSXOpeningElement,
  attrName: string,
  value: string,
  merge: MergeStrategy,
) {
  const attr = getJsxAttribute(openingElement, attrName);

  if (!attr) {
    openingElement.attributes.push(
      t.jsxAttribute(t.jsxIdentifier(attrName), t.stringLiteral(value)),
    );
    return;
  }

  if (merge === "replace") {
    attr.value = t.stringLiteral(value);
    return;
  }

  if (t.isStringLiteral(attr.value)) {
    attr.value.value = `${attr.value.value} ${value}`.trim();
    return;
  }

  if (
    t.isJSXExpressionContainer(attr.value) &&
    t.isExpression(attr.value.expression)
  ) {
    attr.value.expression = t.templateLiteral(
      [
        t.templateElement({ raw: "", cooked: "" }),
        t.templateElement({ raw: ` ${value}`, cooked: ` ${value}` }, true),
      ],
      [attr.value.expression],
    );
  }
}

function applyAttributes(
  openingElement: t.JSXOpeningElement,
  attrs: Map<string, CollectedAttr>,
) {
  for (const [attrName, collected] of attrs) {
    const value =
      collected.merge === "append"
        ? collected.values.join(" ")
        : collected.values[collected.values.length - 1];

    setOrMergeAttribute(openingElement, attrName, value, collected.merge);
  }
}

function processJsxChildren(
  children: t.JSXElement["children"],
  directives: DirectiveConfig,
) {
  for (let i = 0; i < children.length; i++) {
    const firstDirective = getJsxDirectiveValue(children[i], directives);

    if (!firstDirective) {
      continue;
    }

    const attrs = new Map<string, CollectedAttr>();
    const removeIndexes: number[] = [i];

    addCollectedAttr(attrs, firstDirective);

    let j = i + 1;

    while (j < children.length) {
      const child = children[j];

      if (isWhitespaceJsxText(child)) {
        j++;
        continue;
      }

      const nextDirective = getJsxDirectiveValue(child, directives);

      if (nextDirective) {
        addCollectedAttr(attrs, nextDirective);
        removeIndexes.push(j);
        j++;
        continue;
      }

      if (t.isJSXElement(child)) {
        applyAttributes(child.openingElement, attrs);

        for (let k = removeIndexes.length - 1; k >= 0; k--) {
          children.splice(removeIndexes[k], 1);
        }

        i--;
      }

      break;
    }
  }
}

function processLeadingDirectiveComments(
  element: t.JSXElement,
  directives: DirectiveConfig,
) {
  const comments = element.leadingComments;

  if (!comments || comments.length === 0) {
    return;
  }

  const attrs = new Map<string, CollectedAttr>();

  for (const comment of comments) {
    const parsed = parseDirectiveText(comment.value, directives);

    if (parsed) {
      addCollectedAttr(attrs, parsed);
    }
  }

  if (attrs.size === 0) {
    return;
  }

  applyAttributes(element.openingElement, attrs);

  element.leadingComments = comments.filter((comment) => {
    return parseDirectiveText(comment.value, directives) === null;
  });
}

export function commentAttrsPlugin(
  options: CommentAttrsPluginOptions = {},
): Plugin {
  const directives = options.directives ?? DEFAULT_DIRECTIVES;

  return {
    name: "vite-plugin-comment-attrs",
    enforce: "pre",

    transform(code, id) {
      if (!isTargetFile(id, options)) {
        return null;
      }

      if (!codeContainsAnyDirective(code, directives)) {
        return null;
      }

      const ast = parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
      });

      traverse(ast, {
        JSXElement(path: NodePath<t.JSXElement>) {
          processLeadingDirectiveComments(path.node, directives);
          processJsxChildren(path.node.children, directives);
        },

        JSXFragment(path: NodePath<t.JSXFragment>) {
          processJsxChildren(path.node.children, directives);
        },
      });

      const output = generate(
        ast,
        {
          sourceMaps: true,
          sourceFileName: id,
        },
        code,
      );

      return {
        code: output.code,
        map: output.map,
      };
    },
  };
}

export default commentAttrsPlugin;
