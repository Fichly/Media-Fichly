# Compétences Make (copie de integromat/make-skills)

Les dossiers `make-scenario-building`, `make-module-configuring`, `make-mcp-reference` et `make-api-shell-connection-workflow` sont une copie, sans modification, des compétences publiées par Make :

- dépôt : https://github.com/integromat/make-skills
- commit : 8280274d338224c7240d3b110a321ae75abd36c0 (25 août 2026), plugin `make-skills` 0.1.7
- licence : MIT, © 2026 Make (fichier `LICENSE` dans chaque dossier)

Pourquoi une copie : les sessions Claude Code sur le web (claude.ai/code) ne chargent pas les plugins. Elles chargent en revanche les compétences du dossier `.claude/skills/` du dépôt. Le serveur MCP Make est fourni par le connecteur Make du compte claude.ai, pas par ce dossier.

Sur Claude Code en local, préférez le plugin officiel, qui se met à jour tout seul :

```
/plugin marketplace add integromat/make-skills
/plugin install make-skills@make-marketplace
```

Mise à jour de la copie : recloner le dépôt et remplacer ces quatre dossiers.
