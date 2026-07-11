// Intercepteur global : injecte automatiquement l'en-tête Authorization
// (token Sanctum) dans TOUS les appels fetch() de l'application, sans avoir
// à modifier chaque page individuellement. Si le serveur répond 401
// (token invalide/expiré), l'utilisateur est renvoyé vers /login.
//
// Import ce fichier une seule fois, pour ses effets de bord, dans main.jsx :
//   import './authFetch.js'

const TOKEN_KEY = "mini_garage_token";
const originalFetch = window.fetch.bind(window);

window.fetch = async (input, init = {}) => {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = new Headers(init.headers || {});

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await originalFetch(input, { ...init, headers });

  const url = typeof input === "string" ? input : input?.url || "";
  const isApiCall = url.includes("/api/");
  const isLoginCall = url.includes("/api/login");

  if (response.status === 401 && isApiCall && !isLoginCall) {
    localStorage.removeItem(TOKEN_KEY);
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  return response;
};