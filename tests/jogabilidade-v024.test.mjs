import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const html=readFileSync(new URL('../index.html', import.meta.url),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'Mineralchemy deve ter script inline');

async function makeGame(){
 const els=new Map(),events=new Map(),saved=new Map();
 function element(){
  return {value:'',innerHTML:'',textContent:'',focused:false,blurred:false,
    focus(){this.focused=true;this.blurred=false},blur(){this.blurred=true;this.focused=false},
    classList:{add(){},remove(){},toggle(){}},style:{},
    getBoundingClientRect(){return {left:0,top:0,right:800,bottom:550,width:800,height:550}},
    querySelector(){return null},querySelectorAll(){return []},insertAdjacentHTML(){},addEventListener(){}};
 }
 const get=s=>{if(!els.has(s))els.set(s,element());return els.get(s)};
 const app=get('#app');
 const context=vm.createContext({
  document:{querySelector:get,querySelectorAll(){return []}},
  window:{addEventListener(name,fn){events.set(name,fn)}},
  localStorage:{getItem:key=>saved.get(key)??null,setItem:(key,val)=>saved.set(key,val)},
  navigator:{},setTimeout(){return 1},clearTimeout(){},
  HTMLElement:class {}, HTMLInputElement:class {},HTMLSelectElement:class {}, Element:class {},
  console,
 });
 vm.runInContext(script.replace(/void boot\(\);\s*$/,''),context);
 await vm.runInContext('boot()',context);
 return {eval:s=>vm.runInContext(s,context),get,events,saved,app};
}
const key=(k,tag='BODY',id='')=>'handleGameplayShortcut({key:'+JSON.stringify(k)+',target:{tagName:'+JSON.stringify(tag)+',id:'+JSON.stringify(id)+'},ctrlKey:false,metaKey:false,altKey:false,preventDefault(){}})';

test('busca ignora acentos e aceita formas Unicode equivalentes',async()=>{
 const g=await makeGame();
 g.eval("search='cálcio'");
 assert.ok(g.eval("getLibraryItems().some(p=>p.id==='calcium_ion')"));
 g.eval("search='calcio'");
 assert.equal(g.eval("getLibraryItems().some(p=>p.id==='calcium_ion')"),true);
 g.eval("search='ca\\u0301lcio'");
 assert.ok(g.eval("getLibraryItems().some(p=>p.id==='calcium_ion')"));
});

test('qualquer letra, inclusive R e C, inicia busca sem acionar comandos antigos',async()=>{
 const g=await makeGame();
 for(const letter of ['r','c','é','ç']){
  g.eval("search='';pieces=[];");
  g.eval(key(letter));
  assert.equal(g.eval('search'),letter);
  assert.equal(g.get('#catalogSearch').value,letter);
  assert.equal(g.get('#catalogSearch').focused,true);
 }
 g.eval("search=''");
 g.eval("handleGameplayShortcut({key:'@',target:{tagName:'BODY'},ctrlKey:true,altKey:true,metaKey:false,getModifierState(name){return name==='AltGraph'},preventDefault(){}})");
 assert.equal(g.eval('search'),'@');
});

test('Enter seleciona primeiro resultado, limpa, tira foco e Delete limpa bancada',async()=>{
 const g=await makeGame();
 g.eval("search='cál';");
 g.get('#catalogSearch').value='cál';
 const expected=g.eval("getLibraryItems()[0].id");
 g.eval(key('Enter','INPUT','catalogSearch'));
 assert.equal(g.eval('pieces.length'),1);
 assert.equal(g.eval('pieces[0].itemId'),expected);
 assert.equal(g.eval('search'),'');
 assert.equal(g.get('#catalogSearch').value,'');
 assert.equal(g.get('#catalogSearch').blurred,true);
 g.eval(key('Delete'));
 assert.equal(g.eval('pieces.length'),0);
});

test('arrastar peça existente e soltar fora remove da bancada e persiste',async()=>{
 const g=await makeGame();
 g.eval("pieces=[{instanceId:51,itemId:'oxide',x:300,y:220}];");
 g.eval("active={pointerId:3,instanceId:51,origin:'board',moved:true,element:{classList:{remove(){}},style:{}}};");
 g.eval("endPointer({pointerId:3,clientX:900,clientY:220})");
 assert.equal(g.eval('pieces.length'),0);
 assert.equal(JSON.parse(g.saved.get('mineralchemy:board:v05')).length,0);
});

test('reagir com peças demais não altera bancada, e associações em etapas permanecem',async()=>{
 const g=await makeGame();
 g.eval("pieces=[{instanceId:1,itemId:'oxide',x:200,y:180},{instanceId:2,itemId:'proton',x:300,y:180},{instanceId:3,itemId:'chloride',x:400,y:180}];");
 assert.equal(g.eval('reactBoard()'),false);
 assert.equal(g.eval('pieces.length'),3);
 assert.match(g.get('#toast').textContent,/peças demais/i);
 assert.ok(g.eval("engine.reactions.some(r=>r.id.startsWith('prepare-'))"));
});

test('Redução substitui Meio redutor sem alterar id',async()=>{
 const g=await makeGame();
 assert.equal(g.eval("item('reduction').name"),'Redução');
 assert.ok(g.eval("engine.agents.some(a=>a.id==='reduction')"));
});

test('recentes só em Tudo; minerais e íons em ordem A–Z',async()=>{
 const g=await makeGame();
 const id=g.eval("knownItems()[0].id");
 g.eval('selectLibraryPiece('+JSON.stringify(id)+')');
 assert.match(g.eval('libraryMarkup()'),/Usados recentemente/);
 for(const f of ['ion','mineral','agent','compound']){
  g.eval('filter='+JSON.stringify(f));
  assert.doesNotMatch(g.eval('libraryMarkup()'),/Usados recentemente/);
 }
 assert.doesNotMatch(g.eval('mainMarkup()'),/id="librarySort"/);
});

test('Outros se divide em Agentes e Compostos, sem perder espécies',async()=>{
 const g=await makeGame();
 assert.match(g.eval('mainMarkup()'),/data-filter="agent"/);
 assert.match(g.eval('mainMarkup()'),/data-filter="compound"/);
 assert.doesNotMatch(g.eval('mainMarkup()'),/data-filter="other"/);
 g.eval("filter='agent'");
 assert.ok(g.eval("getLibraryItems().every(p=>p.kind==='agent')"));
 g.eval("filter='compound'");
 assert.ok(g.eval("getLibraryItems().every(p=>!['mineral','ion','agent'].includes(p.kind))"));
 g.eval("save.discovered.push('water')");
 assert.ok(g.eval("getLibraryItems().some(p=>p.id==='water')"));
});
