const products=[
{id:1,make:"Ford",category:"Transmission",title:"6R80 Automatic Transmission",fit:"2015–2019 Ford F-150 • 5.0L",price:1295},
{id:2,make:"Chevrolet",category:"Transmission",title:"6L80 Automatic Transmission",fit:"2014–2018 Chevy Silverado • 5.3L",price:1395},
{id:3,make:"Toyota",category:"Engine",title:"2AR-FE 2.5L Engine",fit:"2012–2017 Toyota Camry",price:1850},
{id:4,make:"Ford",category:"Alternator",title:"F-150 Alternator",fit:"2015–2020 Ford F-150 • 3.5L",price:245},
{id:5,make:"Toyota",category:"Headlight",title:"RAV4 LED Headlight",fit:"2019–2022 Toyota RAV4",price:390},
{id:6,make:"Chevrolet",category:"Body Part",title:"Silverado Front Bumper",fit:"2019–2022 Chevy Silverado 1500",price:475}
];
function render(items=products){
 const box=document.getElementById("products"); box.innerHTML="";
 document.getElementById("count").textContent=`${items.length} parts`;
 items.forEach(p=>box.innerHTML+=`<article class="product"><div class="product-img">${p.make}</div><div class="product-body"><span class="tag">${p.category}</span><h3>${p.title}</h3><div class="fit">${p.fit}</div><div class="price">$${p.price.toLocaleString()}</div><a class="btn primary" href="mailto:sales@motorcoreparts.com?subject=Inquiry: ${encodeURIComponent(p.title)}">Ask about this part</a></div></article>`);
}
function applyFilters(){
 const q=document.getElementById("search").value.toLowerCase(), m=document.getElementById("make").value,c=document.getElementById("category").value;
 render(products.filter(p=>(!q||`${p.make} ${p.category} ${p.title} ${p.fit}`.toLowerCase().includes(q))&&(!m||p.make===m)&&(!c||p.category===c)));
 document.getElementById("inventory").scrollIntoView({behavior:"smooth"});
}
function chooseMake(m){document.getElementById("make").value=m;applyFilters()}
document.getElementById("search").addEventListener("keydown",e=>{if(e.key==="Enter")applyFilters()});
document.getElementById("requestForm").addEventListener("submit",e=>{e.preventDefault();document.getElementById("formMsg").textContent="Request received. Connect this form to your email/CRM before going live.";e.target.reset()});
render();
