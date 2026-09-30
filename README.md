# Jaiara Móveis

Landing page e painel administrativo estático da Jaiara Móveis.

## Executar localmente

```powershell
python -m http.server 4173 --directory dist
```

- Site: `http://localhost:4173/`
- Administração: `http://localhost:4173/admin.html`

## Estrutura

- `dist/index.html`: landing page e catálogo público.
- `dist/admin.html`: cadastro de ambientes, produtos, destaques e variações de cor.
- `dist/assets/`: imagens usadas no site.
- `.openai/hosting.json`: configuração da hospedagem no Sites.
- `HANDOFF.md`: estado atual e próximos passos.

## Publicação atual

O site está publicado em <https://jaiara-moveis.pizzamerge.chatgpt.site/>.

