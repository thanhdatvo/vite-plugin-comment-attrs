# Contributing

Thanks for your interest in contributing.
If you find a bug, have an idea, or want to improve the plugin,
feel free to open an issue or submit a pull request.

### Clone the repository

```sh
git clone https://github.com/thanhdatvo/vite-plugin-comment-attrs.git
cd vite-plugin-comment-attrs
```

### Development

Follow these steps

```bash
# Install dependencies
bun install

# Run tests
bun run test

# Build the package so that example projects
# could use the local build
bun run build

# Register this package locally for development
bun link

# Check whether the local package is linked
bun pm ls vite-plugin-comment-attrs

# Install and link dependencies for the React example
bun install:react

# Run the React example
bun dev:react

# Install and link dependencies for the Solid example
bun install:solid

# Run the Solid example
bun dev:solid

```

### Tests

Please add or update tests when changing transform behavior.

```bash
bun run test
```

### Pull requests

Before opening a pull request, please make sure:

- Tests pass.
- The build passes.
- The README is updated if behavior changes.
- The changelog is updated for user-facing changes.
