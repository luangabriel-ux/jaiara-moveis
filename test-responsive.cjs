const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
(async()=>{
 const root=path.join(__dirname,'dist');
 const server=http.createServer((req,res)=>{
  const file=path.join(root,new URL(req.url,'http://localhost').pathname.replace(/^\/$/,'/index.html'));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404).end();return;}
  res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.jpg':'image/jpeg','.webp':'image/webp','.png':'image/png'})[path.extname(file)]||'text/plain');res.end(fs.readFileSync(file));
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
 try{
  browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage();
  await page.route('**/rest/v1/**',route=>route.fulfill({contentType:'application/json',body:JSON.stringify(route.request().url().includes('/environments')?[{id:'sala',name:'Sala',image_url:'assets/produto-6.jpg'}]:Array.from({length:6},(_,i)=>({id:`produto-${i}`,environment_id:'sala',name:'Sofá 2 e 3 lugares',description:'Sofá com acabamento confortável para toda a família.',price:'2.999,99',image_url:'assets/produto-6.jpg',featured:true,product_variants:[{name:'Caramelo',image_url:'assets/produto-6.jpg',position:-1},{name:'Nature off white',image_url:'assets/produto-4.webp',position:0}]})))}));
  await page.goto(`http://127.0.0.1:${server.address().port}`);await page.locator('.product-details-link').first().waitFor();
  for(const [width,columns] of [[320,1],[390,1],[560,1],[561,2],[768,2],[900,2],[901,3],[1280,3]]){
   await page.setViewportSize({width,height:900});
   const layout=await page.evaluate(()=>{
    const grid=document.querySelector('.products'),cards=[...grid.children];
    return {columns:getComputedStyle(grid).gridTemplateColumns.split(' ').length,overflow:document.documentElement.scrollWidth>innerWidth,cards:cards.map(card=>{const rect=card.getBoundingClientRect();return {left:rect.left,right:rect.right,width:rect.width,overflow:card.scrollWidth>card.clientWidth};})};
   });
   assert.equal(layout.columns,columns,`Colunas em ${width}px`);assert(!layout.overflow,`Página transborda em ${width}px`);
   for(const card of layout.cards){assert(card.left>=0&&card.right<=width,`Card fora da tela em ${width}px`);assert(!card.overflow,`Conteúdo transborda em ${width}px`);assert(Math.abs(card.width-layout.cards[0].width)<1,'Cards com larguras diferentes');}
  }
  await page.setViewportSize({width:390,height:844});await page.locator('.color-option').nth(1).click();assert((await page.locator('.product img').first().getAttribute('src')).endsWith('produto-4.webp'));
  console.log('PASS catálogo com seis produtos: 320–1280px, 1/2/3 colunas, cards uniformes, sem transbordamento e troca de cor no celular');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
