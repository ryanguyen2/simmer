let subs = [];
export function subscribeToToasts(fn){ subs.push(fn); return ()=> subs = subs.filter(s=>s!==fn); }
export function showToast(text, duration=1800){
  const t = { id: Math.random().toString(36).slice(2,9), text, duration };
  subs.forEach(fn => fn(t));
}
