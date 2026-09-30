# Handoff — Jaiara Móveis

Atualizado em 30 de setembro de 2026.

## Estado atual

- Landing page responsiva publicada em <https://jaiara-moveis.pizzamerge.chatgpt.site/>.
- Painel administrativo disponível em `/admin.html` e também acessível por `/admin` na hospedagem.
- Ambientes, produtos e destaques podem ser cadastrados no painel.
- Cada produto pertence a um ambiente.
- O preço é único por produto, independentemente da cor.
- Cada cor pode ter uma imagem própria; o cliente troca a imagem usando os botões de cores.
- A vitrine pública filtra os produtos quando o cliente seleciona um ambiente.
- Há uma opção para voltar aos destaques e uma mensagem para ambientes ainda sem produtos.
- A seção de localização utiliza uma imagem de mapa e aponta para o Google Maps.
- Cabeçalho, rodapé e imagens principais já foram revisados.

## Decisões técnicas

- O projeto é um site estático, sem etapa de build.
- Todo o conteúdo executável está dentro de `dist/`.
- O catálogo administrativo usa a chave `jaiara_catalog_v1` no `localStorage`.
- Quando não existe catálogo salvo, a página pública usa um catálogo inicial embutido em `dist/index.html`.
- O deploy é controlado pelo projeto Sites identificado em `.openai/hosting.json`.

## Limitação importante

Os dados cadastrados no painel ficam somente no navegador onde foram criados. Eles não são sincronizados com outros computadores ou clientes. Para transformar o painel em uma administração real e centralizada, é necessário adicionar autenticação e um banco de dados online, migrando ambientes, produtos, imagens e variações para esse backend.

## Próxima etapa recomendada

1. Criar banco de dados e armazenamento de imagens.
2. Proteger `/admin` com autenticação.
3. Migrar o catálogo do `localStorage` para uma API.
4. Manter o catálogo inicial como fallback durante a migração.
5. Testar cadastro, edição, exclusão, filtros e variações em navegadores diferentes.

## Git e publicação

- Branch principal: `main`.
- O remoto `sites` pertence à hospedagem atual e não deve ser substituído.
- Última versão publicada antes deste handoff: versão 12.
- URL de produção: <https://jaiara-moveis.pizzamerge.chatgpt.site/>.

