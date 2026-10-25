export function updateLoadingScreen(progress,label='Loading your little world…'){
 const root=document.getElementById('loading-screen');if(!root)return;
 const value=Math.max(0,Math.min(1,Number(progress)||0)),bar=root.querySelector('.loading-screen__fill'),status=root.querySelector('.loading-screen__status');
 if(bar)bar.style.transform=`scaleX(${value})`;
 root.querySelector('[role="progressbar"]')?.setAttribute('aria-valuenow',String(Math.round(value*100)));
 if(status)status.textContent=label;
}

export function finishLoadingScreen(){
 const root=document.getElementById('loading-screen');if(!root)return;
 updateLoadingScreen(1,'Ready');
 requestAnimationFrame(()=>{root.classList.add('loading-screen--ready');setTimeout(()=>root.remove(),240);});
}
