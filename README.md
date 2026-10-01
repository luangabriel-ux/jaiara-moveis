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
- `dist/produto.html?id=<id>`: página de detalhes de um produto, com cores e contato pelo WhatsApp.
- `dist/product.js` e `dist/product-config.js`: carregamento dos detalhes e configuração pública do catálogo.
- `dist/assets/`: imagens usadas no site.
- `supabase/schema.sql`: estrutura e políticas de segurança do banco.
- `.openai/hosting.json`: configuração da hospedagem no Sites.
- `HANDOFF.md`: estado atual e próximos passos.

## Publicação atual

O site está publicado no Netlify em <https://jaiara-moveis.netlify.app/>.

O catálogo público e o painel utilizam Supabase. Somente e-mails cadastrados em `admin_users` e existentes no Supabase Auth podem alterar dados.

## Hospedagem no Netlify

- Projeto: jaiara-moveis (equipe luangabriel-ux).
- ID: add78a85-4db0-460e-a84d-444078b9f6f4.
- Publicação manual: enviar o conteúdo de dist ou jaiara-moveis-netlify.zip pelo Netlify Drop.
- Sem comando de build; diretório publicado: dist.
- Rota /admin configurada em dist/_redirects.
- Banco e autenticação permanecem no Supabase.
- Publicações futuras exigem novo upload; não há integração automática com Git.

## Desenvolvimento e sincronização

Toda atualização deve ser verificada, registrada em commit e enviada ao GitHub pelo remoto `origin`. As instruções permanentes estão em `AGENTS.md`. O remoto `sites` deve ser preservado.

Os testes `test-primary.cjs` e `test-product.cjs` verificam a imagem principal e a página de detalhes. O segundo precisa de Playwright e Microsoft Edge instalados. Executar com Node.js; se as dependências estiverem fora do projeto, definir `NODE_PATH` para o diretório que contém Playwright.

No catálogo, a foto, o nome e o link "Ver detalhes" abrem a página do produto. O botão "Tenho interesse neste produto" abre o WhatsApp da loja com nome do produto, cor selecionada (quando informada) e link dos detalhes. Nenhuma mensagem é enviada automaticamente.

