const API = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

let tokenProvider = async () => null;
export function setTokenProvider(fn) { tokenProvider = fn; }

async function req(path, { method="GET", body, auth=false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const t = await tokenProvider();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const res = await fetch(`${API}${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/* Posts */
export const apiGetFeed = (page=1, limit=6) => req(`/posts?page=${page}&limit=${limit}`);
export const apiGetSaved = () => req(`/posts/saved`, { auth: true });
export const apiGetPost  = (id) => req(`/posts/${id}`);
export const apiCreatePost = (payload) => req(`/posts`, { method:"POST", body:payload, auth:true });
export const apiToggleLike = (id) => req(`/posts/${id}/like`, { method:"POST", auth:true });
export const apiToggleSave = (id) => req(`/posts/${id}/save`, { method:"POST", auth:true });
export const apiDeletePost = (id) => req(`/posts/${id}`, { method:"DELETE", auth:true });

/* Comments */
export const apiListComments = (id) => req(`/posts/${id}/comments`);
export const apiAddComment = (id, text) => req(`/posts/${id}/comments`, { method:"POST", body:{ text }, auth:true });

/* Stories & recommended */
export const apiStories = () => req(`/stories`);
export const apiRecommended = () => req(`/recommended`);

/* Users */
export const apiMe = () => req(`/auth/me`, { auth: true });
export const apiSearchUsers = (q) => req(`/users?q=${encodeURIComponent(q||"")}`);
export const apiGetUser = (handle) => req(`/users/${handle}`);
export const apiGetUserPosts = (handle) => req(`/users/${handle}/posts`);
export const apiUpdateMe = (payload) => req(`/users/me`, { method:"PATCH", body:payload, auth:true });
