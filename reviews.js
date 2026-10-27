(()=>{
  const mainTrack=document.querySelector('#review-stack');
  const dialog=document.querySelector('#review-dialog');
  if(!mainTrack||!dialog)return;
  const title=dialog.querySelector('#review-dialog-title');
  const body=dialog.querySelector('#review-dialog-text');
  const close=dialog.querySelector('.review-dialog-close');
  let lastTrigger=null;
  document.querySelectorAll('.review-track').forEach(track=>track.addEventListener('click',event=>{
    const button=event.target.closest('.review-more');
    if(!button||button.closest('[aria-hidden="true"]'))return;
    const card=button.closest('.review-card');
    lastTrigger=button;
    title.textContent=card.querySelector('.review-author').textContent;
    body.textContent=card.querySelector('.review-quote').textContent;
    dialog.showModal();
    close.focus();
  }));
  close.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
  dialog.addEventListener('close',()=>lastTrigger?.focus());
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  document.querySelectorAll('.review-marquee').forEach(marquee=>{
    const track=marquee.querySelector('.review-track');
    if(!track)return;
    const duration=parseFloat(getComputedStyle(track).animationDuration)||65;
    let pointer=null,startX=0,startTransform=0;
    const currentX=()=>{const value=getComputedStyle(track).transform;return value==='none'?0:new DOMMatrixReadOnly(value).m41};
    marquee.addEventListener('pointerdown',event=>{
      if(event.target.closest('button'))return;
      pointer=event.pointerId;startX=event.clientX;startTransform=currentX();
      marquee.classList.add('is-dragging');marquee.setPointerCapture(pointer);
      track.style.transform='translateX('+startTransform+'px)';
    });
    marquee.addEventListener('pointermove',event=>{
      if(pointer!==event.pointerId)return;
      track.style.transform='translateX('+(startTransform+event.clientX-startX)+'px)';
    });
    const end=event=>{
      if(pointer!==event.pointerId)return;
      const x=currentX(),distance=track.querySelector('.review-marquee-group')?.getBoundingClientRect().width||0;
      if(distance){const phase=marquee.classList.contains('review-marquee-reverse')?((x%distance)+distance)%distance/distance:(((-x)%distance)+distance)%distance/distance;track.style.animationDelay='-'+(phase*duration)+'s'}
      track.style.transform='';marquee.classList.remove('is-dragging');pointer=null;
    };
    marquee.addEventListener('pointerup',end);marquee.addEventListener('pointercancel',end);
  });
})();

