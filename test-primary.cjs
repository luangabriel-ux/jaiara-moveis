const fs=require('fs'),vm=require('vm'),assert=require('assert');
for(const file of ['dist/index.html','dist/admin.html']){
 const html=fs.readFileSync(file,'utf8');
 for(const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(match[1]);
}
const html=fs.readFileSync('dist/index.html','utf8');
const source=html.slice(html.indexOf('const renderProducts='),html.indexOf('const showFeatured='));
const node=()=>({textContent:'',innerHTML:'',hidden:false});
const context={eyebrow:node(),title:node(),description:node(),resetButton:node(),productsGrid:node(),renderCount:0,catalog:{environments:[]},safe:s=>String(s||'')};
vm.createContext(context);vm.runInContext(source+';globalThis.render=renderProducts;',context);
context.render([{name:'Sofá',image:'principal.jpg',variants:[{name:'Azul',image:'azul.jpg'},{name:'Bege',image:'principal.jpg'}]}]);
let output=context.productsGrid.innerHTML;
assert(output.includes('src="principal.jpg"'));
assert(output.includes('class="color-option active"'));
assert(output.indexOf('>Bege</button>')<output.indexOf('>Azul</button>'));
assert.equal((output.match(/data-image="principal.jpg"/g)||[]).length,1);
context.render([{name:'Antigo',image:'principal.jpg',variants:[{name:'Azul',image:'azul.jpg'}]}]);
assert(context.productsGrid.innerHTML.includes('>Imagem principal</button>'));
assert(context.productsGrid.innerHTML.includes('src="principal.jpg"'));
context.render([{name:'Sem principal',variants:[{name:'Azul',image:'azul.jpg'}]}]);
assert(context.productsGrid.innerHTML.includes('src="azul.jpg"'));
console.log('PASS sintaxe, prioridade da principal, cor inicial, ausência de duplicação e compatibilidade com produtos antigos');
