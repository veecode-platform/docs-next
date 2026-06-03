#!/usr/bin/env python3
"""
Generates devportal/plugins/ecosystem.md from export-overlays workspace metadata.
Reads _export-overlays/workspaces/*/metadata/*.yaml (sparse checkout in CI).
"""
import glob
import yaml
from pathlib import Path

OVERLAYS_DIR = "_export-overlays"
OUTPUT = Path("devportal/plugins/ecosystem.md")

HEADER = """\
---
sidebar_position: 50
sidebar_label: Plugin Ecosystem
title: "Plugin Ecosystem"
---

:::note[Auto-generated]
This page is generated automatically from [devportal-plugin-export-overlays](https://github.com/veecode-platform/devportal-plugin-export-overlays).
Do not edit manually — changes will be overwritten on the next CI run.
:::

# Plugin Ecosystem

All plugins available as OCI artifacts for VeeCode DevPortal. Enable any of these via `dynamic-plugins.yaml` or a preset.

| Plugin | npm Package | OCI Reference | Role | Support |
|--------|-------------|---------------|------|---------|
"""

def main():
    files = sorted(glob.glob(f"{OVERLAYS_DIR}/workspaces/*/metadata/*.yaml"))
    if not files:
        print(f"ERROR: no metadata YAMLs found under {OVERLAYS_DIR}/workspaces/")
        raise SystemExit(1)

    plugins = []
    for path in files:
        with open(path) as f:
            doc = yaml.safe_load(f)
        if not doc or doc.get("kind") != "Package":
            continue
        spec = doc.get("spec", {})
        meta = doc.get("metadata", {})
        if spec.get("lifecycle") == "deprecated":
            continue
        plugins.append({
            "title": meta.get("title") or meta.get("name", ""),
            "package": spec.get("packageName", ""),
            "oci": spec.get("dynamicArtifact", ""),
            "role": spec.get("backstage", {}).get("role", ""),
            "support": spec.get("support", ""),
        })

    plugins.sort(key=lambda p: p["title"].lower())

    rows = []
    for p in plugins:
        oci = f"`{p['oci']}`" if p["oci"] else "—"
        pkg = f"`{p['package']}`" if p["package"] else "—"
        rows.append(f"| {p['title']} | {pkg} | {oci} | {p['role']} | {p['support']} |")

    footer = f"\n*{len(plugins)} plugins. Updated automatically from [export-overlays](https://github.com/veecode-platform/devportal-plugin-export-overlays).*\n"

    OUTPUT.write_text(HEADER + "\n".join(rows) + footer)
    print(f"Generated {OUTPUT} — {len(plugins)} plugins")

if __name__ == "__main__":
    main()
