const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const fixture={id:'11111111-1111-4111-8111-111111111111',name:'Sofá & conforto',description:'Descrição completa\nMedidas: 2 metros',price:'R$ 1.234,56',image_url:'assets/produto-6.jpg',environments:{name:'Sala'},product_variants:[{name:'Azul',image_url:'assets/produto-4.webp',position:0},{name:'Bege',image_url:'assets/produto-6.jpg',position:-1}]};
(async()=>{
 const root=path.join(__dirname,'dist');
 const server=http.createServer((req,res)=>{let pathname=new URL(req.url,'http://localhost').pathname;const file=path.join(root,pathname==='/'?'index.html':pathname);if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.statusCode=404;res.end();return;}const ext=path.extname(file);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.jpg':'image/jpeg','.webp':'image/webp','.png':'image/png'})[ext]||'text/plain');res.end(fs.readFileSync(file));});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin=`http://127.0.0.1:${server.address().port}`;
 let browser;
 try{
  browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/rest/v1/**',route=>{const url=new URL(route.request().url());let data;if(url.pathname.endsWith('/environments'))data=[{id:'sala',name:'Sala',image_url:'assets/produto-6.jpg',position:0}];else if(url.searchParams.has('id'))data=url.searchParams.get('id').includes(fixture.id)?fixture:null;else data=[{...fixture,environment_id:'sala',featured:true,position:0}];return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});});
  await page.goto(origin);await page.locator('.product-details-link').waitFor();await page.locator('.product-details-link').click();await page.locator('#detail').waitFor({state:'visible'});
  assert.equal(await page.locator('#productName').innerText(),fixture.name);assert.equal(await page.locator('#description').innerText(),fixture.description);assert.equal(await page.locator('#price').innerText(),fixture.price);
  assert((await page.locator('#productPhoto').getAttribute('src')).endsWith('produto-6.jpg'));assert.equal(await page.locator('.color.active').innerText(),'Bege');
  let url=new URL(await page.locator('#interest').getAttribute('href'));assert.equal(url.hostname,'wa.me');assert.equal(url.pathname,'/5562992270667');assert(url.searchParams.get('text').includes(fixture.name));assert(url.searchParams.get('text').includes('Bege'));
  await page.getByRole('button',{name:'Azul',exact:true}).click();assert((await page.locator('#productPhoto').getAttribute('src')).endsWith('produto-4.webp'));url=new URL(await page.locator('#interest').getAttribute('href'));assert(url.searchParams.get('text').includes('Azul'));assert(url.searchParams.get('text').includes(`/produto.html?id=${fixture.id}`));
  await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(__dirname,'produto-detalhes.png'),fullPage:true});
  await page.goto(origin+'/produto.html?id=22222222-2222-4222-8222-222222222222');await page.getByText(/não está mais disponível/).waitFor();assert(!(await page.locator('#detail').isVisible()));
  await page.goto(origin+'/produto.html');await page.getByText(/Selecione um produto/).waitFor();
  assert.deepEqual(errors,[]);console.log('PASS navegação, descrição/preço, imagem e cor principal, troca de cor, WhatsApp com nome/cor/link, mobile, produto inexistente e ID ausente; sem erros JS');
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;});
