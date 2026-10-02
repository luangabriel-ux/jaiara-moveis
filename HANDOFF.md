# Handoff — Jaiara Móveis

Atualizado em 1 de outubro de 2026.

## Estado atual

- Site estático responsivo em `dist/index.html`, sem etapa de build.
- Painel em `dist/admin.html`, com login por e-mail e senha via Supabase Auth.
- Catálogo público e painel integrados ao Supabase; os dados não dependem mais do localStorage.
- Banco: `environments`, `products`, `product_variants` e `admin_users`.
- Cada produto pertence a um ambiente, tem preço único e pode ter cores com imagens próprias.
- `supabase/schema.sql` define relações, políticas RLS e bucket `product-images`, com limite de 5 MB e formatos JPEG, PNG e WebP.
- Administradores precisam existir no Supabase Auth e ter e-mail autorizado em `admin_users`.
- A página pública usa catálogo inicial embutido quando a consulta falha ou não há ambientes no banco.
- Hospedagem configurada em `.openai/hosting.json`, projeto `appgprj_6abd351ec4848191956ade04433f27d6`.
- Endereço registrado: https://jaiara-moveis.pizzamerge.chatgpt.site/.

## Validação executada

### Backend real, sem sessão administrativa

- Ambientes: HTTP 200, 4 registros.
- Produtos com relação `product_variants`: HTTP 200, 3 produtos. Não há variações cadastradas.
- Consulta anônima a `admin_users`: HTTP 200, lista vazia, sem exposição de e-mails. Isso não comprova ausência de administradores.
- Configurações do Supabase Auth: HTTP 200.
- Login deliberadamente inválido: HTTP 400, `invalid_credentials`.
- Inserção anônima de ambiente: HTTP 401, violação de RLS. Nome nulo foi usado para impedir criação de registro mesmo se a proteção falhasse.
- Nenhum dado do catálogo foi alterado.

### Interface local, navegador Edge automatizado

- 4 ambientes e 3 produtos na apresentação inicial.
- Sala e estar, Painéis e racks e Linha infantil: 1 produto em cada filtro.
- Quarto e conforto: mensagem de ambiente sem produtos.
- Voltar aos destaques: restaura 3 produtos.
- Sem sessão: login visível e painel administrativo oculto.
- Nenhum erro JavaScript de execução durante esses testes.
- Testes realizados nos arquivos locais, sem comprovar a versão publicada.

### Hospedagem

- Requisições sem autenticação a `/`, `/admin.html` e `/admin`: HTTP 401.
- Configuração existente, mas acesso público e versão publicada ainda não validados. Investigar a restrição antes de divulgar o endereço.

## Fluxos pendentes de teste autenticado

Sem sessão administrativa disponível, não foi possível executar de ponta a ponta:

1. Login válido, autorização administrativa e logout.
2. Cadastro, edição e exclusão de ambientes e produtos.
3. Upload e leitura pública de imagens no bucket real.
4. Cadastro, edição e remoção de cores, e troca de imagens na vitrine.
5. Atualização em outro navegador após salvar pelo painel.
6. Bloqueio de exclusão de ambiente com produtos e exclusão em cascata das variações.

Usar registros temporários identificados e remover dados e arquivos de teste ao terminar. Preservar produtos reais.

## Pontos encontrados na revisão do código

- Salvar produto, remover variações antigas e inserir novas são operações separadas. Uma falha intermediária pode deixar atualização parcial ou perda de cores anteriores; não há transação única.
- Excluir produtos não remove arquivos do armazenamento; uploads podem ficar sem referência.
- Com catálogo totalmente vazio, `showFeatured()` não atualiza a grade; voltar aos destaques pode manter título/mensagem anteriores.
- `products.updated_at` tem valor inicial, mas não há trigger no esquema nem atualização pelo painel.
- O SQL usa `create policy` sem proteção contra políticas existentes; não reaplicar integralmente sem preparação.

## Próximos passos

1. Validar os fluxos autenticados com sessão administrativa.
2. Tratar falhas parciais ao salvar cores e o estado do catálogo vazio.
3. Resolver o HTTP 401 da hospedagem e confirmar a versão pública integrada ao Supabase.
4. Definir domínio próprio, se desejado; não é requisito para usar o endereço atual com acesso liberado.

## Git e publicação

- Preservar o remoto `sites`, reservado à hospedagem atual.
- O handoff anterior registrava versão 12; a versão publicada atual não foi confirmada nesta validação.

## Publicação concluída no Netlify — 1 de outubro de 2026

Esta atualização substitui a pendência de acesso público descrita acima para a hospedagem antiga.

- Endereço definitivo: https://jaiara-moveis.netlify.app/.
- Administração: https://jaiara-moveis.netlify.app/admin.
- Projeto: jaiara-moveis, equipe luangabriel-ux.
- Site ID: add78a85-4db0-460e-a84d-444078b9f6f4.
- Deploy: 6abe457958ec3500a5f0fffa, enviado manualmente pelo Netlify Drop.
- Site público com HTTPS; páginas /, /admin e /admin.html e logo retornaram HTTP 200.
- No navegador, catálogo com 4 ambientes e 3 produtos, sem imagens quebradas na verificação.
- Integração Supabase presente nas páginas publicadas.
- Rota /admin definida em dist/_redirects.
- Publicação manual, sem build nem deploy automático via Git.
- Os testes autenticados do painel e os pontos de revisão do código continuam pendentes; publicar não conclui esses testes.
- Configuração Sites antiga e remoto sites preservados.

## Formas de pagamento — 1 de outubro de 2026

- Informações da vitrine atualizadas: crediário em até 12x e pagamento à distância por link.
- Cartões em até 12x, dinheiro e Pix continuam apresentados.
- O site divulga as modalidades; a emissão do link de pagamento segue pelo atendimento da loja.

## Acesso administrativo confirmado — 1 de outubro de 2026

- Usuário jaiaramoveis2017@hotmail.com criado no Supabase Auth e autorizado em admin_users.
- Login válido testado no painel publicado: catálogo carregou 4 ambientes, 3 produtos e 3 destaques.
- Logout confirmado: retorno ao formulário de login.
- Senha não registrada nos arquivos do projeto.
- Cadastro, edição, exclusão e uploads ainda precisam de validação autenticada completa.

## Teste autenticado do cadastro — 1 de outubro de 2026

Teste real via API Supabase, com usuário administrativo e registros temporários:

- Login e autorização aprovados.
- Upload JPEG no bucket product-images e acesso público HTTP 200 aprovados.
- Criação de produto com ambiente, descrição, preço e imagem aprovada.
- Inclusão de duas cores e leitura pública com relação product_variants aprovadas.
- Edição de nome/preço, marcação de destaque e substituição de duas cores por uma aprovadas.
- Exclusão do produto e exclusão em cascata das cores aprovadas.
- Produto, cores e imagem de teste removidos; sessão de teste encerrada.
- Nenhum produto real foi editado.

Limite: o navegador de controle não respondeu em duas tentativas. Os testes acima validam o backend real usado pelo painel, mas não o envio pelo formulário do navegador. O risco de falha parcial durante substituição de cores continua: as operações não são transacionais.

## Correção da imagem e cor principal — 1 de outubro de 2026

- Correção local em dist/index.html: imagem principal tem prioridade sobre imagens das cores; opção principal aparece primeiro e selecionada.
- Cor principal é identificada pelo registro correspondente à imagem; quando ainda não informada, o botão mostra Imagem principal.
- Painel ganhou campo obrigatório Cor da imagem principal. Ao salvar, grava essa cor em product_variants com position -1, usando a imagem principal; demais cores mantêm position >= 0.
- Edição carrega o nome da cor principal separadamente; miniatura administrativa usa a imagem principal.
- Produtos existentes preservados. Para identificar sua cor principal, editar e preencher o novo campo após a publicação.
- Teste test-primary.cjs aprovado: sintaxe, prioridade, seleção da cor principal, deduplicação e compatibilidade.
- ZIP jaiara-moveis-netlify.zip atualizado. Publicação PENDENTE: conexão do controle do navegador expirou mesmo após reinicialização. A versão pública ainda não contém esta correção.

## Página específica de produto e sincronização GitHub — 1 de outubro de 2026

- Foto, nome e Ver detalhes no catálogo abrem produto.html?id=<id>.
- Página mostra imagem principal, descrição completa, preço, ambiente e cores.
- Tenho interesse neste produto abre WhatsApp 5562992270667 com nome, cor selecionada quando informada e link da página. Não envia mensagem automaticamente.
- Produtos inexistentes, ID ausente e falhas de consulta têm mensagens próprias.
- Testes locais em Edge com respostas de catálogo controladas: navegação, conteúdo, seleção da imagem/cor principal, troca de cor, WhatsApp, largura de celular e estados vazios aprovados; sem erros JS.
- Consulta pública real de produtos com product_variants e environments aprovada.
- Preferência permanente do usuário registrada em AGENTS.md: finalizar mudanças com commit e push para origin.
- Esta entrega inclui as mudanças locais anteriores de Supabase, Netlify, formas de pagamento e imagem principal.
- ZIP atualizado. A nova página ainda NÃO foi publicada pelo agente no Netlify: controle do navegador continua expirando. A publicação anterior da correção principal foi confirmada pelo usuário.

## Telas de edição e ambiente Outros — 1 de outubro de 2026

- Editar abre uma tela própria com os campos preenchidos e a imagem atual; ambiente mostra produtos vinculados e permite abrir sua edição.
- Edição de produto inclui ambiente, descrição, preço, destaque, imagem/cor principal e demais cores; salvar e cancelar retornam à origem.
- URLs com hash permitem reabrir a tela de edição ao recarregar; registro inexistente retorna ao catálogo com aviso.
- Ambiente Outros (ID 00000000-0000-4000-8000-000000000001) criado automaticamente no primeiro carregamento administrativo desta versão, se ausente; esquema SQL atualizado para instalações novas.
- Sem seleção de ambiente, produto vai para Outros. Outros é o último no painel/vitrine; nome e imagem não editáveis pelo painel; sem botão Excluir. Ver produtos permite mover os produtos normalmente.
- Excluir um ambiente transfere todos os seus produtos para Outros antes de excluir; falha na transferência preserva o ambiente. Falha na exclusão após transferência deixa os produtos em Outros e informa a situação.
- Não há transação única nem nova restrição no banco: proteção de Outros é aplicada pelo painel, enquanto administradores diretos do Supabase continuam com as permissões existentes.
- Testes de interface com backend simulado em Edge: edição/preenchimento, salvar, mover produto e cores, cancelar, reabrir após recarga, erro de gravação, Outros automático/protegido, transferência na exclusão e falha segura aprovados. Layout móvel verificado.
- Nenhum produto real foi alterado por estes testes.
- Versão preparada em ZIP para o Netlify; publicação desta atualização ainda pendente.

## Responsividade do catálogo — 2 de outubro de 2026

- Corrigida regra posterior que sobrescrevia as media queries e mantinha três colunas no celular.
- Destaques e filtro por ambiente agora usam uma coluna até 560px, duas até 900px e três acima de 900px, com cards de mesma largura e sem tratamento especial do primeiro card.
- Textos longos e botões de cores ficam contidos nos cards.
- test-responsive.cjs aprovado em Edge com seis produtos simulados nas larguras 320, 390, 560, 561, 768, 900, 901 e 1280px; colunas, limites dos cards, ausência de transbordamento e troca de cor móvel verificados.
- test-primary.cjs e test-product.cjs também aprovados. Nenhum produto real alterado.
- ZIP atualizado para publicação manual. Esta correção ainda NÃO foi publicada no Netlify; push no GitHub não dispara publicação automática.

## Publicação confirmada — 2 de outubro de 2026

- ZIP atualizado enviado ao projeto existente jaiara-moveis no Netlify Drop.
- Deploy 6abfabb5c6b8f9611456f439 confirmado como Currently published / Production.
- Site público https://jaiara-moveis.netlify.app/ verificado em 390px: sete produtos carregados, uma coluna e sem transbordamento horizontal.
- Esta publicação inclui o conteúdo atual de dist/, com a correção de responsividade. Pendências de publicação anteriores deste documento ficam superadas para os arquivos atuais.
