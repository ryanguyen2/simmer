// Frontend-only data layer using localStorage (demo mode).

const LS_KEY = "simmer-db-v6";
const CUR_KEY = "simmer-current-user";

function ensureSeed() {
  if (localStorage.getItem(LS_KEY)) return;
  const now = Date.now();

  // 🏀 NBA avatars
  const users = [
    { id: "u1", name: "LeBron James",   handle: "lebron",   avatar: "/avatars/lebron.jpg",  bio: "taco tuesdayyyyy" },
    { id: "u2", name: "Stephen Curry",  handle: "curry",    avatar: "/avatars/curry.jpg",   bio: "Splash chef" },
    { id: "u3", name: "Kevin Durant",   handle: "durant",   avatar: "/avatars/durant.jpg",  bio: "Slim Reaper recipes." },
    { id: "u4", name: "Giannis A.",     handle: "giannis",  avatar: "/avatars/giannis.jpg", bio: "I specialize in greek food" },
    { id: "u5", name: "Nikola Jokic",   handle: "jokic",    avatar: "/avatars/jokic.jpg",   bio: "I like horses" },
    { id: "u6", name: "Luka Doncic",    handle: "luka",     avatar: "/avatars/luka.jpg",    bio: "Euro kitchen tricks" },
    { id: "u7", name: "Jayson Tatum",   handle: "tatum",    avatar: "/avatars/tatum.jpg",   bio: "we did itttttt" },
    { id: "u8", name: "Jimmy Butler",   handle: "butler",   avatar: "/avatars/butler.jpg",  bio: "I wake up early to cook" },
  ];

  const img = (u) => `https://images.unsplash.com/${u}?q=80&w=1600&auto=format&fit=crop`;

  const posts = [
    { id:"p1", userId:"u1", title:"10-min Garlic Chili Noodles",
      images:[img("photo-1540189549336-e6e99c3679fe"), img("photo-1526318472351-c75fcf070305")],
      tags:["noodles","quick","spicy"], cookTime:"10 min", servings:"1 bowl", difficulty:"Easy",
      likes:324, comments:2, createdAt: now - 2*3600e3,
      ingredients:["200g noodles","2 cloves garlic","1 tbsp chili oil","1 tsp soy sauce"],
      steps:["Boil noodles.","Sauté garlic with chili oil.","Toss noodles with soy."] },
    { id:"p2", userId:"u2", title:"Creamy Mushroom Fettuccine",
      images:[img("photo-1473093295043-cdd812d0e601")],
      tags:["pasta","vegetarian"], cookTime:"25 min", servings:"2", difficulty:"Medium",
      likes:771, comments:3, createdAt: now - 5*3600e3,
      ingredients:["250g fettuccine","mushrooms","cream","garlic"],
      steps:["Cook pasta.","Sauté mushrooms.","Add cream, toss."] },
    { id:"p3", userId:"u7", title:"Neapolitan Margherita",
      images:[img("photo-1548365328-9f547fb0953b"), img("photo-1542282811-943ef1a977c2")],
      tags:["pizza","bake"], cookTime:"90 min", servings:"2", difficulty:"Hard",
      likes:412, comments:1, createdAt: now - 26*3600e3,
      ingredients:["Caputo flour","San Marzano","Mozzarella","Basil"],
      steps:["Make dough.","Ferment.","Stretch & bake hot."] },
    { id:"p4", userId:"u5", title:"Paneer Butter Masala",
      images:[img("photo-1589308078057-336c1ee05a2b")],
      tags:["curry","comfort"], cookTime:"35 min", servings:"3", difficulty:"Medium",
      likes:958, comments:0, createdAt: now - 3*24*3600e3,
      ingredients:["Paneer","Tomato","Butter","Cream","Spices"],
      steps:["Make gravy.","Add paneer.","Simmer."] },
    { id:"p5", userId:"u6", title:"Shoyu Ramen Broth",
      images:[img("photo-1569718212165-3a8278d5f624")],
      tags:["ramen","broth"], cookTime:"4 h", servings:"3 bowls", difficulty:"Hard",
      likes:215, comments:0, createdAt: now - 8*3600e3,
      ingredients:["Chicken bones","Kombu","Soy tare"],
      steps:["Simmer stock.","Season tare.","Assemble."] },
    { id:"p6", userId:"u8", title:"Roasted Veggie Grain Bowl",
      images:[img("photo-1512621776951-a57141f2eefd")],
      tags:["vegetarian","healthy"], cookTime:"30 min", servings:"2", difficulty:"Easy",
      likes:144, comments:0, createdAt: now - 90*60*1e3,
      ingredients:["Quinoa","Veggies","Tahini"],
      steps:["Roast veg.","Cook grains.","Dress & serve."] },
  ];

 
  const stories = [
    { id: "s2", userId: "u2", images: [img("photo-1504674900247-0877df9cc836")], createdAt: now - 5*3600e3, expiresAt: now + 19*3600e3 },
    { id: "s3", userId: "u3", images: [img("photo-1499028344343-cd173ffc68a9")], createdAt: now - 8*3600e3, expiresAt: now + 16*3600e3 },
  ];


  const recommended = [
    { id:"r1", title:"My Chili Crisp Eggs", image: img("photo-1508737804141-4c3b688e2546"), postId:"p1" },
    { id:"r2", title:"Weeknight Teriyaki Salmon", image: img("photo-1512621776951-a57141f2eefd"), postId:"p6" },
    { id:"r3", title:"One-pot Tomato Orzo", image: img("photo-1526318472351-c75fcf070305"), postId:"p2" },
  ];

  const comments = [
    { id:"c1", postId:"p1", userId:"u2", text:"Making this tonight!", createdAt: now - 3600e3 },
    { id:"c2", postId:"p1", userId:"u3", text:"So quick and tasty 🔥", createdAt: now - 1800e3 },
    { id:"c3", postId:"p2", userId:"u1", text:"That sauce looks silky!", createdAt: now - 2*3600e3 },
  ];

  const seed = { users, posts, stories, recommended, comments, follows: [], saved: [], likes: [] };
  localStorage.setItem(LS_KEY, JSON.stringify(seed));
}
ensureSeed();

function load() { return JSON.parse(localStorage.getItem(LS_KEY)); }
function save(db) { localStorage.setItem(LS_KEY, JSON.stringify(db)); }
const sleep = (ms=250) => new Promise(r => setTimeout(r, ms));
const nid = (p="id") => p + Math.random().toString(36).slice(2,9);

function timeAgo(ts){ const s=Math.floor((Date.now()-ts)/1000);
  if (s<60) return `${s}s`; const m=Math.floor(s/60); if (m<60) return `${m}m`;
  const h=Math.floor(m/60); if (h<24) return `${h}h`; const d=Math.floor(h/24); return `${d}d`;
}

/* ---------- Demo helpers ---------- */
export function getDemoUsers(){ const db=load(); return db.users.map(u=>({ id:u.id, name:u.name, handle:u.handle, avatar:u.avatar })); }
export function getCurrentUserId(){ return localStorage.getItem(CUR_KEY) || "u1"; }
export function setCurrentUserId(id){ localStorage.setItem(CUR_KEY, id); }
export function getCurrentUserHandle(){ const db=load(); const u=db.users.find(x=>x.id===getCurrentUserId()); return u?.handle || "lebron"; }
export function resetDemo({ setUserId="u1" }={}){ localStorage.removeItem(LS_KEY); ensureSeed(); if (setUserId) setCurrentUserId(setUserId); }

/* ---------- Users ---------- */
export function getUserById(id){ const db=load(); return db.users.find(u=>u.id===id)||null; }
export async function getUserByHandle(handle){ await sleep(100); const db=load();
  const u=db.users.find(x=>x.handle.toLowerCase()===(handle||"").toLowerCase().replace(/^@/,"")); if(!u) return null;
  const posts=db.posts.filter(p=>p.userId===u.id).sort((a,b)=>b.createdAt-a.createdAt);
  return { user:u, posts: posts.map(p=>decoratePost(p, db)) };
}
export async function updateUser({ id, name, handle, avatar, bio }){ await sleep(150);
  const db=load(); const u=db.users.find(x=>x.id===id); if(!u) throw new Error("User not found");
  if (name!=null) u.name=name; if (handle!=null) u.handle=handle.replace(/^@/,""); if (avatar!=null) u.avatar=avatar; if (bio!=null) u.bio=bio;
  save(db); return u;
}

/* ---------- Feed & Saved ---------- */
function decoratePost(p, db){ return { ...p, author: db.users.find(u=>u.id===p.userId), time: timeAgo(p.createdAt) }; }
export async function getPostById(postId){ await sleep(60); const db=load(); const p=db.posts.find(x=>x.id===postId); return p?decoratePost(p,db):null; }
export async function getFeed({ cursor=null, limit=6 }={}){ await sleep();
  const db=load(); const sorted=db.posts.slice().sort((a,b)=>b.createdAt-a.createdAt);
  let start=0; if(cursor){ const i=sorted.findIndex(p=>p.id===cursor); start=i+1; }
  const page=sorted.slice(start, start+limit).map(p=>decoratePost(p, db));
  const nextCursor=(start+limit<sorted.length)?page[page.length-1].id:null;
  return { items:page, nextCursor };
}
export async function getSavedPosts(userId){ await sleep(); const db=load();
  const saved=db.saved.filter(s=>s.userId===userId).map(s=>s.postId);
  const posts=db.posts.filter(p=>saved.includes(p.id)).sort((a,b)=>b.createdAt-a.createdAt);
  return posts.map(p=>decoratePost(p, db));
}
export function getSavedCount(postId){ const db=load(); return db.saved.filter(s=>s.postId===postId).length; }
export async function toggleSave({ userId, postId }){ await sleep(120); const db=load();
  const i=db.saved.findIndex(s=>s.userId===userId && s.postId===postId);
  if(i>=0) db.saved.splice(i,1); else db.saved.push({ userId, postId });
  save(db); return db.saved.some(s=>s.userId===userId && s.postId===postId);
}
export async function toggleLike({ userId, postId }){ await sleep(120); const db=load();
  const i=db.likes.findIndex(s=>s.userId===userId && s.postId===postId);
  const post=db.posts.find(p=>p.id===postId); if(!post) return 0;
  if(i>=0){ db.likes.splice(i,1); post.likes=Math.max(0,post.likes-1); }
  else { db.likes.push({ userId, postId }); post.likes+=1; }
  save(db); return post.likes;
}
export async function deletePost({ userId, postId }){ await sleep(120);
  const db=load(); const post=db.posts.find(p=>p.id===postId);
  if(!post || post.userId!==userId) throw new Error("Not allowed");
  db.posts=db.posts.filter(p=>p.id!==postId);
  db.saved=db.saved.filter(s=>s.postId!==postId);
  db.likes=db.likes.filter(s=>s.postId!==postId);
  db.comments=db.comments.filter(c=>c.postId!==postId);
  save(db); return true;
}
export async function createPost({ userId, title, images=[], tags=[], cookTime, servings, difficulty, ingredients=[], steps=[] }){
  await sleep(200); const db=load();
  const post={ id:nid("p"), userId, title, images, tags, cookTime, servings, difficulty, ingredients, steps,
    likes:0, comments:0, createdAt: Date.now() };
  db.posts.unshift(post); save(db); return decoratePost(post, db);
}

/* ---------- Stories ---------- */
export async function getStories(){ await sleep(100); const db=load();
  const now=Date.now();
  return db.stories.filter(s=>!s.expiresAt || s.expiresAt>now)
    .map(s=>({ ...s, author: db.users.find(u=>u.id===s.userId) }));
}
export async function createStory({ userId, images = [], hours = 24 }) {
  await new Promise(r => setTimeout(r, 150));
  const db = JSON.parse(localStorage.getItem("simmer-db-v6")); 
  const now = Date.now();
  const expireAt = now + hours * 3600 * 1000;

 
  const idx = db.stories.findIndex(
    s => s.userId === userId && (!s.expiresAt || s.expiresAt > now)
  );

  if (idx >= 0) {
   
    const s = db.stories[idx];
    s.images = [...images, ...s.images];   
    s.createdAt = now;
    s.expiresAt = Math.max(s.expiresAt || 0, expireAt);
   
    db.stories.splice(idx, 1);
    db.stories.unshift(s);
  } else {
    
    db.stories.unshift({
      id: "s" + Math.random().toString(36).slice(2, 9),
      userId,
      images,
      createdAt: now,
      expiresAt: expireAt
    });
  }

  localStorage.setItem("simmer-db-v6", JSON.stringify(db));
  return true;
}


/* ---------- Discover / Follow ---------- */
export async function searchUsers(query=""){ await sleep(150); const db=load(); const q=query.trim().toLowerCase();
  return db.users.filter(u=>!q || u.name.toLowerCase().includes(q)||u.handle.toLowerCase().includes(q)).slice(0,24);
}
export async function toggleFollow({ followerId, followeeId }){ await sleep(100); const db=load();
  if(followerId===followeeId) return false;
  const i=db.follows.findIndex(f=>f.followerId===followerId && f.followeeId===followeeId);
  if(i>=0) db.follows.splice(i,1); else db.follows.push({ followerId, followeeId });
  save(db); return db.follows.some(f=>f.followerId===followerId && f.followeeId===followeeId);
}
export async function isFollowing({ followerId, followeeId }){ await sleep(1); const db=load();
  return db.follows.some(f=>f.followerId===followerId && f.followeeId===followeeId);
}

/* ---------- Suggested Recipes ---------- */
export async function getRecommendedRecipes(){ await sleep(120); const db=load(); return db.recommended.slice(); }

/* ---------- Comments ---------- */
export async function listComments(postId){ await sleep(80); const db=load();
  const cs=db.comments.filter(c=>c.postId===postId).sort((a,b)=>a.createdAt-b.createdAt);
  return cs.map(c=>({ ...c, user: db.users.find(u=>u.id===c.userId), time: timeAgo(c.createdAt) }));
}
export async function addComment({ userId, postId, text }){ await sleep(100); const db=load();
  const c={ id:nid("c"), postId, userId, text, createdAt: Date.now() }; db.comments.push(c);
  const p=db.posts.find(x=>x.id===postId); if(p) p.comments=db.comments.filter(x=>x.postId===postId).length;
  save(db); return c;
}
