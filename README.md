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

Os testes `test-primary.cjs`, `test-product.cjs` e `test-admin-edit.cjs` verificam imagem principal, página de detalhes, edição e regras do ambiente Outros. Os dois últimos precisam de Playwright e Microsoft Edge instalados. Executar com Node.js; se as dependências estiverem fora do projeto, definir `NODE_PATH` para o diretório que contém Playwright. Os testes de interface usam dados controlados, sem alterar o catálogo real.

No catálogo, a foto, o nome e o link "Ver detalhes" abrem a página do produto. O botão "Tenho interesse neste produto" abre o WhatsApp da loja com nome do produto, cor selecionada (quando informada) e link dos detalhes. Nenhuma mensagem é enviada automaticamente.

## Edição e ambientes

O catálogo de destaques e os produtos filtrados por ambiente usam uma coluna até 560px, duas até 900px e três em telas maiores. Os cards têm larguras uniformes, com textos e opções de cor contidos no card. Executar `node test-responsive.cjs` com Playwright para verificar os limites de tela de 320 a 1280px. Correção publicada no Netlify em 2 de outubro de 2026; layout móvel confirmado no site público.

Editar um ambiente abre uma tela própria com seus dados e os produtos vinculados. Cada produto tem uma tela de edição com dados preenchidos, ambiente, preço, destaque, cor e imagem principal e demais cores. Cancelar ou voltar retorna à lista de origem; recarregar uma URL de edição reabre o registro.

O painel cria automaticamente o ambiente Outros se necessário. Sem seleção de ambiente, o produto é salvo em Outros, que fica sempre por último na vitrine. Seus dados não podem ser editados ou excluídos pelo painel; a opção Ver produtos permite acessar e mover seus produtos.

Ao excluir outro ambiente, o painel transfere seus produtos para Outros antes de excluir o ambiente. Se a transferência falhar, a exclusão não ocorre. Se apenas a exclusão falhar, os produtos permanecem em Outros e o painel informa o resultado. Essas operações são sequenciais. As proteções de Outros são regras do painel; usuários com acesso direto de administrador ao Supabase ainda têm as permissões existentes do banco.

