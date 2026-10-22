# Molt for VS Code

Snippets and project commands for [Molt](https://github.com/micheltlutz/molt), the safe HTML
DSL for Rust. Autocomplete for the API itself already comes from rust-analyzer; this extension
adds what rust-analyzer does not.

## Commands

Open the Command Palette (`Cmd+Shift+P`) and type `Molt`.

| command | does |
| --- | --- |
| **Molt: New Project** | runs `cargo new` and `cargo add molt-framework`, writes a working `main.rs` and opens the folder |
| **Molt: Add to Current Project** | runs `cargo add molt-framework` in the open folder |
| **Molt: Run (cargo run)** | runs `cargo run` in a terminal |

You need Rust installed. If you do not have it, see
[the new-to-Rust guide](https://github.com/micheltlutz/molt/blob/main/docs/new-to-rust.md).

## Snippets (in `.rs` files)

| prefix | inserts |
| --- | --- |
| `molt-use` | `use molt::prelude::*;` |
| `molt-html` | an `html!` block |
| `molt-el` | an element with the fluent builder |
| `molt-page` | a complete `Document` |
| `molt-layout` | a `Layout` implementation |
| `molt-for`, `molt-if` | `@for` and `@if` inside `html!` |
| `molt-seo` | `SeoBuilder` |
| `molt-sitemap` | `SitemapGenerator` |
| `molt-ssg` | `StaticSiteGenerator` writing a page to disk |

Every snippet was compiled against `molt-framework` 1.1.1.

## Develop

```bash
npm install
npm run compile
```

Press `F5` to open an Extension Development Host. `npm run package` builds a `.vsix`.

## License

MIT
