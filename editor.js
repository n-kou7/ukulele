function normalizeChordText(t){
  let s=(t||"").trim();
  s=s.replace(/（/g,"(").replace(/）/g,")");
  s=s.split("/")[0];
  s=s.replace(/♯|＃/g,"#").replace(/♭/g,"b");
  s=s.replace(/m7-5/gi,"m7b5");
  s=s.replace(/\(.*?\)/g,"");
  const m=s.match(/^([A-G])([#b]?)(.*)$/);
  if(!m)return s;
  let root=m[1],acc=m[2]||"",q=m[3]||"";
  if(acc==="#")acc="s";
  return root+acc+q;
}

const $=id=>document.getElementById(id);
const state={frets:[null,null,null,null]};

function updateName(){
  const name=$("root").value+$("acc").value+$("qual").value;
  $("normalized").value=name;
  $("filename").value=name+".png";
}

function draw(){
  const cv=$("cv"),ctx=cv.getContext("2d");
  const off=document.createElement("canvas");
  off.width=200;off.height=200;
  const g=off.getContext("2d");
  g.fillStyle="#fff";g.fillRect(0,0,200,200);
  g.fillStyle="#000";g.font="14px sans-serif";
  g.textAlign="center";g.fillText($("normalized").value,100,16);

  const m=30,w=140,h=140;
  for(let i=0;i<4;i++){
    let x=m+i*(w/3);
    g.lineWidth=i===0?3:1;
    g.beginPath();g.moveTo(x,m);g.lineTo(x,m+h);g.stroke();
  }
  for(let f=0;f<=4;f++){
    let y=m+f*(h/4);
    g.lineWidth=f===0?3:1;
    g.beginPath();g.moveTo(m,y);g.lineTo(m+w,y);g.stroke();
  }

  function dot(s,f){
    let x=m+s*(w/3),y=m+(f-0.5)*(h/4);
    g.beginPath();g.arc(x,y,7,0,Math.PI*2);g.fill();
  }

  state.frets.forEach((f,s)=>{if(f&&f>0)dot(s,f)});
  if($("sharpAll1").checked)for(let s=0;s<4;s++)dot(s,1);

  ctx.clearRect(0,0,200,200);
  ctx.save();ctx.translate(0,200);ctx.rotate(-Math.PI/2);
  ctx.drawImage(off,0,0);ctx.restore();
}

document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll(".cell").forEach(b=>{
    b.onclick=()=>{
      const s=+b.dataset.s,f=+b.dataset.f;
      state.frets[s]=state.frets[s]===f?null:f;
      b.classList.toggle("on");
      draw();
    };
  });
  ["root","acc","qual","sharpAll1"].forEach(id=>$(id).onchange=()=>{updateName();draw();});
  $("btnNormalize").onclick=()=>{
    const n=normalizeChordText($("rawChord").value);
    $("normalized").value=n;
    $("filename").value=n+".png";
    draw();
  };
  $("btnClear").onclick=()=>{state.frets=[null,null,null,null];document.querySelectorAll(".cell").forEach(b=>b.classList.remove("on"));draw();};
  $("btnOpen").onclick=()=>{window.open($("cv").toDataURL("image/png"),"_blank");};
  updateName();draw();
});
