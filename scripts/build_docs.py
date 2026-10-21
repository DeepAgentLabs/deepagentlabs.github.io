"""Publish repository-owned documentation with the shared DeepAgentLabs theme."""

import argparse
import json
import logging
import re
import shutil
from pathlib import Path
from urllib.parse import urlsplit

from mkdocs.commands.build import build
from mkdocs.config import load_config
from mkdocs.config.defaults import MkDocsConfig
from pymdownx.superfences import fence_code_format

ROOT = Path(__file__).resolve().parent.parent
PROJECTS = {
    "agenticlens": ("AgenticLens", "agenticlens", "docs", "mkdocs.yml"),
    "agentic-sidecar": (
        "Agentic Sidecar",
        "agentic-sidecar",
        "website/docs",
        "website/mkdocs.yml",
    ),
    "agentic-chaos": ("Agentic Chaos", "agentic-chaos", "docs", "mkdocs.yml"),
    "agentic-evals": ("Agentic Evals", "agentic-evals", "docs", None),
    "mcp-server": ("MCP Server", "mcp", "docs", "mkdocs.yml"),
    "agenticops-control-tower": ("Control Tower", "control-tower", ".", None),
}
GROUPS = [
    "Getting started",
    "Guides",
    "Integrations",
    "Examples",
    "Reference",
    "Deployment and operations",
    "Compatibility and releases",
]


def title(path):
    match = re.search(r"^#\s+(.+)", path.read_text(), re.MULTILINE)
    return match.group(1).strip() if match else path.stem.replace("-", " ").title()


def category(path):
    stem = path.stem.lower()
    if (
        "examples" in path.parts
        or "usecases" in path.parts
        or "reference-workflow" in stem
    ):
        return "Examples"
    if stem in ("index", "readme", "getting-started", "installation", "quickstart"):
        return "Getting started"
    if re.search(
        r"(compatib|aios-v|chaos-0|sidecar-|tower-0|control-tower-0|lens-0|mcp-0|evals-|roadmap|changelog|v0\.)",
        stem,
    ):
        return "Compatibility and releases"
    if "example" in str(path) or "usecase" in str(path) or "reference-workflow" in stem:
        return "Examples"
    if any(
        s in stem
        for s in (
            "hosting",
            "authentication",
            "live-operations",
            "fleet-operations",
            "incident-recovery",
            "troubleshooting",
            "configuration",
            "safety",
            "limitations",
        )
    ):
        return "Deployment and operations"
    if any(s in stem for s in ("reference", "schema", "export-format", "tools", "cli")):
        return "Reference"
    if any(s in stem for s in ("integration", "connector", "alignment")):
        return "Integrations"
    return "Guides"


def prepare(project, repo, staging):
    name, slug, docs, original = PROJECTS[project]
    if staging.exists():
        shutil.rmtree(staging)
    if project == "agenticops-control-tower":
        staging.mkdir(parents=True)
        shutil.copytree(repo / "docs", staging / "docs")
        shutil.copytree(repo / "examples", staging / "examples")
        for path in repo.glob("*.md"):
            if path.name not in (
                "AGENTS.md",
                "PRE_RELEASE.md",
                "CI.md",
                "DeepAgent-Control-Tower-Concept.md",
            ):
                shutil.copy2(path, staging / path.name)
        home = "README.md"
    else:
        shutil.copytree(repo / docs, staging)
        home = "index.md"
    if project in ("agenticlens", "agenticops-control-tower"):
        readme = (repo / "README.md").read_text()
        sections = []
        for heading in ("Installation", "Quickstart"):
            match = re.search(
                r"^## " + heading + r"\n(.*?)(?=^## |\Z)",
                readme,
                re.MULTILINE | re.DOTALL,
            )
            if match:
                sections.append(f"## {heading}\n\n{match.group(1).strip()}")
        (staging / "quickstart.md").write_text(
            "# Getting started\n\n"
            "Follow the repository-maintained setup and first-run instructions below. "
            "Examples that reference local files assume a checkout of the source repository.\n\n"
            + "\n\n".join(sections)
            + "\n\n## Next steps\n\n[Explore the documentation](index.md#documentation-guides)\n".replace(
                "index.md", home
            )
        )
    # Links into source examples and root guides belong on GitHub when outside docs.
    for page in staging.rglob("*.md"):

        def source_link(match, page=page):
            url = match.group(2)
            parsed = urlsplit(url)
            if (
                parsed.scheme
                or parsed.netloc
                or not parsed.path
                or parsed.path.startswith("/")
            ):
                return match.group(0)
            target = (page.parent / parsed.path).resolve()
            if target.is_relative_to(staging) and target.exists():
                return match.group(0)
            source = (repo / docs / page.relative_to(staging)).parent / parsed.path
            source = source.resolve()
            if source.is_relative_to(repo) and source.exists():
                kind = "tree" if source.is_dir() else "blob"
                fragment = "#" + parsed.fragment if parsed.fragment else ""
                return f"[{match.group(1)}](https://github.com/DeepAgentLabs/{project}/{kind}/main/{source.relative_to(repo).as_posix()}{fragment})"
            return match.group(0)

        page.write_text(
            re.sub(r"\[([^\]]*)\]\(([^\s)]+)\)", source_link, page.read_text())
        )
    # Evals' legacy HTML site is retained in Git, but all public guides now use Markdown.
    if project == "agentic-evals":
        for path in staging.rglob("*.html"):
            path.unlink()
    original_values = (
        load_config(config_file=str(repo / original)).user_configs[0]
        if original
        else {}
    )
    config = MkDocsConfig(config_file_path=str(ROOT / "docs-theme/base.yml"))
    config.load_dict(original_values)
    # Keep source page URLs and existing anchors; only navigation and presentation change.
    home_path = staging / home
    text = home_path.read_text()
    intro = '\n\n<div class="docs-start" markdown>\n\n**Start here**\n\n'
    quickstart = next(
        (p for p in ("getting-started.md", "quickstart.md") if (staging / p).exists()),
        None,
    )
    intro += f"[Get started]({quickstart}) · " if quickstart else ""
    intro += (
        "[Browse guides](#documentation-guides) · [View source](https://github.com/DeepAgentLabs/"
        + project
        + ")\n\n</div>\n"
    )
    first_line, _, rest = text.partition("\n")
    home_path.write_text(first_line + intro + "\n" + rest)
    groups = {group: [] for group in GROUPS}
    groups["Getting started"].append({"Overview": home})
    all_pages = sorted(staging.rglob("*.md"))
    for path in all_pages:
        relative = path.relative_to(staging)
        if str(relative) == home:
            continue
        if relative.parts[0] == "examples" and path.name != "README.md":
            continue
        group = category(relative)
        groups[group].append({title(path): relative.as_posix()})
    # First-run instructions come before deeper concepts and version notes.
    groups["Getting started"][1:] = sorted(
        groups["Getting started"][1:], key=lambda p: next(iter(p.values()))
    )
    nav = [{group: pages} for group, pages in groups.items() if pages]
    with home_path.open("a") as stream:
        stream.write("\n\n## Documentation guides\n\n")
        for group, pages in groups.items():
            if not pages:
                continue
            stream.write(f"### {group}\n\n")
            for page in pages:
                label, url = next(iter(page.items()))
                if url != home:
                    stream.write(f"- [{label}]({url})\n")
            stream.write("\n")
    shutil.copy2(
        ROOT / "docs-theme/docs.css",
        staging / "assets/dal-docs.css"
        if (staging / "assets").exists()
        else staging / "dal-docs.css",
    )
    css = "assets/dal-docs.css" if (staging / "assets").exists() else "dal-docs.css"
    config.load_dict(
        {
            "exclude_docs": "",
            "draft_docs": "",
            "not_in_nav": "",
            "strict": True,
            "site_name": name,
            "site_url": f"https://deepagentlabs.io/{slug}/docs/",
            "repo_url": f"https://github.com/DeepAgentLabs/{project}",
            "repo_name": f"DeepAgentLabs/{project}",
            "docs_dir": str(staging),
            "nav": nav,
            "theme": {
                "name": "material",
                "custom_dir": str(ROOT / "docs-theme/overrides"),
                "font": False,
                "palette": [
                    {
                        "scheme": "default",
                        "primary": "custom",
                        "accent": "custom",
                        "toggle": {
                            "icon": "material/weather-night",
                            "name": "Switch to dark mode",
                        },
                    },
                    {
                        "scheme": "slate",
                        "primary": "custom",
                        "accent": "custom",
                        "toggle": {
                            "icon": "material/weather-sunny",
                            "name": "Switch to light mode",
                        },
                    },
                ],
                "features": [
                    "navigation.sections",
                    "navigation.top",
                    "navigation.footer",
                    "navigation.tracking",
                    "search.suggest",
                    "search.highlight",
                    "content.code.copy",
                    "content.tabs.link",
                    "toc.follow",
                ],
            },
            "extra_css": [css],
            "extra_javascript": ["legacy-links.js"]
            if project == "agentic-evals"
            else [],
            "plugins": ["search"],
            "markdown_extensions": [
                "admonition",
                "attr_list",
                "md_in_html",
                "tables",
                "toc",
                "pymdownx.details",
                "pymdownx.highlight",
                "pymdownx.inlinehilite",
                {
                    "pymdownx.superfences": {
                        "custom_fences": [
                            {
                                "name": "mermaid",
                                "class": "mermaid",
                                "format": fence_code_format,
                            }
                        ]
                    }
                },
                {"pymdownx.tabbed": {"alternate_style": True}},
            ],
            "extra": {
                "products": [
                    {
                        "name": item[0],
                        "url": f"https://deepagentlabs.io/{item[1]}/docs/",
                    }
                    for item in PROJECTS.values()
                ]
            },
            "validation": {
                "nav": {"omitted_files": "info"},
                "links": {
                    "not_found": "warn",
                    "unrecognized_links": "info",
                    "anchors": "info",
                },
            },
        }
    )
    return config


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sources", type=Path)
    parser.add_argument("--repo", type=Path)
    parser.add_argument("--project", choices=PROJECTS)
    parser.add_argument("--all", action="store_true")
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
    if args.project and not args.repo:
        parser.error("--project requires --repo")
    if not args.project and not args.sources:
        parser.error("--sources is required when building multiple projects")
    projects = (
        [args.project]
        if args.project
        else list(PROJECTS)
        if args.all
        else ["mcp-server", "agenticops-control-tower"]
    )
    for project in projects:
        repo = args.repo.resolve() if args.project else args.sources.resolve() / project
        output = (
            args.output.resolve()
            if args.project
            else args.output.resolve() / PROJECTS[project][1] / "docs"
        )
        staging = args.output.resolve().parent / f".docs-source-{project}"
        config = prepare(project, repo, staging)
        config.site_dir = str(output)
        errors, _warnings = config.validate()
        if errors:
            raise ValueError(errors)
        build(config)
        assert (output / "index.html").is_file(), project
        pages = []
        for path in sorted(staging.rglob("*.md")):
            relative = path.relative_to(staging).with_suffix("").as_posix()
            parts = relative.split("/")
            if parts[-1] in ("index", "README"):
                parts.pop()
            url = "/".join(parts) + "/" if parts else ""
            pages.append(f"- [{title(path)}]({config.site_url}{url})")
        (output / "llms.txt").write_text(
            f"# {config.site_name}\n\n" + "\n".join(pages) + "\n"
        )
        print(
            json.dumps({"project": project, "output": str(output), "pages": len(pages)})
        )


if __name__ == "__main__":
    main()
