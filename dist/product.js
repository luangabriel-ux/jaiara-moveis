const productDb=supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
const byId=id=>document.getElementById(id);
function productColors(product){
  const saved=(product.product_variants||[]).filter(v=>v.image_url).sort((a,b)=>a.position-b.position);
  const main=saved.find(v=>v.image_url===product.image_url);
  return product.image_url?[{name:main?.name||'',image_url:product.image_url},...saved.filter(v=>v.image_url!==product.image_url)]:saved;
}
function interestUrl(product,color){
  const message=`Olá! Tenho interesse no produto ${product.name}${color?`, na cor ${color}`:''}. Gostaria de saber mais sobre disponibilidade e condições de pagamento.\n${location.origin}/produto.html?id=${encodeURIComponent(product.id)}`;
  return `https://wa.me/5562992270667?text=${encodeURIComponent(message)}`;
}
function showProduct(product){
  document.title=`${product.name} — Jaiara Móveis`;
  byId('productName').textContent=product.name;
  byId('breadcrumbName').textContent=product.name;
  byId('description').textContent=product.description||'Fale com nossa equipe para conhecer todos os detalhes deste produto.';
  byId('price').textContent=product.price||'Consulte o preço';
  byId('category').textContent=product.environments?.name||'Produto da loja';
  const colors=productColors(product);
  function selectColor(index){
    const color=colors[index];
    byId('productPhoto').src=color?.image_url||product.image_url||'assets/sala-contato.png';
    byId('productPhoto').alt=`${product.name}${color?.name?` — ${color.name}`:''}`;
    byId('selectedColor').textContent=color?.name?`Cor: ${color.name}`:'Imagem principal';
    byId('interest').href=interestUrl(product,color?.name);
    [...byId('colors').children].forEach((button,i)=>{button.classList.toggle('active',i===index);button.setAttribute('aria-pressed',String(i===index));});
  }
  byId('colors').replaceChildren();
  colors.forEach((color,index)=>{
    const button=document.createElement('button');button.type='button';button.className='color';button.textContent=color.name||'Imagem principal';button.addEventListener('click',()=>selectColor(index));byId('colors').appendChild(button);
  });
  byId('colorSection').hidden=!colors.length;
  selectColor(0);
  byId('status').hidden=true;byId('detail').hidden=false;
}
async function loadProduct(){
  const id=new URLSearchParams(location.search).get('id');
  if(!id){byId('status').textContent='Selecione um produto no catálogo para ver os detalhes.';return;}
  try{
    let product;
    if(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)){
      const {data,error}=await productDb.from('products').select('*,product_variants(*),environments(name)').eq('id',id).maybeSingle();
      if(error)throw error;product=data;
    }else{
      const demo=defaultCatalog.products.find(p=>p.id===id);
      if(demo)product={...demo,image_url:demo.image,environments:{name:defaultCatalog.environments.find(e=>e.id===demo.environmentId)?.name},product_variants:[]};
    }
    if(!product){byId('status').textContent='Este produto não está mais disponível no catálogo. Volte ao catálogo para conhecer outras opções.';return;}
    showProduct(product);
  }catch(error){byId('status').textContent='Não foi possível carregar o produto. Tente novamente em instantes ou fale com a loja pelo WhatsApp.';}
}
loadProduct();
