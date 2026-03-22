<template> 
  <client-only> 
    <NavBar :navAdminMode="navAdminMode" /> 
    <div id="vrMain" class="vr-main">
      <div id="vrLoginBox" class="vr-login-box vr-hidden">
         <div class="vr-login-header">Log In</div>
         <div class="vr-login-slogan">Separating Fact from Fiction</div>
         <div id="vrLoginMessage" class="vr-login-message vr-hidden"></div>
         <div id="vrLoginForm" class="vr-login-form">
            <input id="vrLoginUsername" class="vr-login-input" type="text" placeholder="Username" />
            <input id="vrLoginPassword" class="vr-login-input" type="password" placeholder="Password" />
            <div id="vrLoginActions" class="vr-login-actions">
               <div id="vrLoginOK" class="vr-login-action vr-login-ok" data-busy="0">Log In</div>
            </div>
         </div>
      </div>
    </div> 
   <Cookies /> 
   <Copyright /> 
    
  </client-only> 
</template> 
 
<script setup lang="ts"> 
//import { useSeoMeta, useHead } from "@vueuse/head"; 
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
 
const title = "VERA"; 
const description = "Vera is an automated fact-checking platform that allows users to verify the accuracy of online articles, URLs, and headlines in real-time."; 
 
useSeoMeta({ 
  title: () => title, 
   description: () => description, 
  charset: "utf-8", 
  viewport: "width=device-width, initial-scale=1.0", 
}); 
 
useHead({ 
  link: [ 
    { rel: "icon", type: "image/png", href: "/logo.png" }, 
    { rel: "stylesheet", href: "/reset.css" }, 
    { rel: "stylesheet", href: "/custom.css" }, 
    { rel: "preconnect", href: "https://fonts.googleapis.com" }, 
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }, 
    { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Uncial+Antiqua&display=swap" }, 
  ], 
}); 
 
const globalDelay = 500; 
 
const allowCookies = useCookie<boolean>("allowCookies", { 
  sameSite: "none", 
  secure: true, 
  maxAge: 60 * 60 * 24, 
}); 
allowCookies.value = allowCookies.value ?? false; 
 
const retries = useCookie<number>("retries", { 
  sameSite: "none", 
  secure: true, 
  maxAge: 60 * 60, 
}); 
retries.value = retries.value ?? 0; 
 
const username = useCookie<string>("username", { 
  sameSite: "none", 
  secure: true, 
  maxAge: 60 * 60 * 24, 
}); 
username.value = username.value ?? ""; 
 
const accessToken = useCookie<string>("accessToken", { 
  sameSite: "none", 
  secure: true, 
  maxAge: 60 * 60 * 24, 
}); 
accessToken.value = accessToken.value ?? ""; 
 
const userLevel = useCookie<number>("userLevel", { 
  sameSite: "none", 
  secure: true, 
  maxAge: 60 * 60 * 24, 
}); 
userLevel.value = userLevel.value ?? -1; 
 
const fullName = useCookie<string>("fullName", {
  sameSite: "none", 
  secure: true, 
  maxAge: 60 * 60 * 24, 
}); 
fullName.value = fullName.value ?? ""; 
 
const router = useRouter(); 
let navAdminMode = userLevel.value >= 2 ? "vr-nav-admin" : ""; 
const vrServer = "https://vera-api-dev1.vercel.app"; 
 
type AuthResponse = { 
  accessToken: string; 
  userLevel: number; 
  fullName: string; 
  message: string; 
}; 
 
function getByID<T extends HTMLElement>(id: string) { 
  return document.getElementById(id) as T; 
} 
 
let lastLoginClicked = 0; 
function checkAuthorizations() { 
  if (accessToken.value) { 
    if (userLevel.value <= 1) { 
      router.push("/"); 
    } else if (userLevel.value >= 2) { 
      router.push("/admin"); 
    } 
  } 
 
  const loginBox = getByID<HTMLDivElement>("vrLoginBox"); 
  const loginForm = getByID<HTMLDivElement>("vrLoginForm"); // FIXED
  const loginUsername = getByID<HTMLInputElement>("vrLoginUsername"); 
  const loginPassword = getByID<HTMLInputElement>("vrLoginPassword"); 
  const loginMessage = getByID<HTMLDivElement>("vrLoginMessage"); // FIXED
  const logInActions = getByID<HTMLDivElement>("vrLoginActions"); // FIXED
  const loginOK = getByID<HTMLDivElement>("vrLoginOK"); 
 
  if ( 
    !loginBox || 
    !loginForm || 
    !loginUsername || 
    !loginPassword || 
    !loginMessage || 
    !logInActions || 
    !loginOK 
  ) return; 
 
  if (retries.value >= 3) { 
    loginForm.classList.add("vr-hidden"); 
    loginMessage.classList.remove("vr-hidden"); 
    loginMessage.innerText = "Too many attempts, try again after 1 hour."; 
    logInActions.classList.add("vr-hidden"); 
    return; 
  } 
 
  loginOK.dataset.busy = "0"; 
  loginBox.classList.remove("vr-hidden"); 
 
  loginOK.addEventListener("click", () => { 
    if (loginOK.dataset.busy == "1") return; 
 
    const tempUsername = loginUsername.value; 
    const tempPassword = loginPassword.value; 
 
    if (!tempUsername) { 
      loginMessage.innerText = "Username is required."; 
      loginMessage.classList.remove("vr-hidden"); 
      return; 
    } 
 
    if (!tempPassword) { 
      loginMessage.innerText = "Password is required."; 
      loginMessage.classList.remove("vr-hidden"); 
      return; 
    } 
 
    authorizeEmail(tempUsername, tempPassword); 
  }); 
 
  loginUsername.addEventListener("keyup", (e) => { 
    if (e.key === "Enter" && loginUsername.value) { 
      loginPassword.focus(); 
    } 
  }); 
 
  loginPassword.addEventListener("keyup", (e) => { 
    if (e.key === "Enter") loginOK.click(); 
  }); 
 
  loadModal(); 
} 
 
async function authorizeEmail(tempUsername: string, tempPassword: string) { 
  if (lastLoginClicked >= Date.now() - globalDelay) return; 
  lastLoginClicked = Date.now(); 
 
  const loginUsername = getByID<HTMLInputElement>("vrLoginUsername"); 
  const loginPassword = getByID<HTMLInputElement>("vrLoginPassword"); 
  const loginMessage = getByID<HTMLDivElement>("vrLoginMessage"); // FIXED
  const loginOK = getByID<HTMLDivElement>("vrLoginOK"); 
 
  if (!loginUsername || !loginPassword || !loginOK || !loginMessage) return; 
 
  loginMessage.innerText = ""; 
  loginMessage.classList.add("vr-hidden"); 
  loginUsername.disabled = true; 
  loginPassword.disabled = true; 
  loginOK.dataset.busy = "1"; 
 
  try { 
    userLevel.value = -1; 
    // FIXED: "vrait" typo changed to "await"
    const response = (await $fetch(`${vrServer}/authorize`, { 
      headers: { "Content-Type": "application/json" }, 
      method: "POST", 
      body: { 
        username: tempUsername, 
        password: tempPassword, 
      }, 
    })) as AuthResponse; 
 
    accessToken.value = String(response.accessToken); 
    userLevel.value = Number(response.userLevel); 
    fullName.value = String(response.fullName); 
    if (accessToken.value) { 
      username.value = tempUsername; 
    } 
    loginOK.dataset.busy = "0"; 
 
    if (!accessToken.value) { 
      retries.value = (retries.value || 0) + 1; 
    } 
 
    if (response.message) { 
      loginMessage.innerText = response.message; 
      loginMessage.classList.remove("vr-hidden"); 
    } 
  } catch (e: any) { 
    loginMessage.innerText = `Error encountered: ${e}`; 
    loginMessage.classList.remove("vr-hidden"); 
  } 
 
  loginUsername.disabled = false; 
  loginPassword.disabled = false; 
  loginUsername.value = ""; 
  loginPassword.value = ""; 
  loginOK.dataset.busy = "0"; 
  checkAuthorizations(); 
} 
 
function loadModal() { 
  const cookieModal = getByID<HTMLDivElement>("vrCookieModal"); 
  const cookieBox = getByID<HTMLDivElement>("vrCookieBox"); 
  const cookieX = getByID<HTMLDivElement>("vrCookieX"); 
  const cookieOK = getByID<HTMLDivElement>("vrCookieOK"); 
  if (!cookieModal || !cookieBox || !cookieX || !cookieOK) return; 
 
  if (allowCookies.value === true) { 
    allowAllCookies(); 
    return; 
  }
  showCookiePopup(); 
 
  cookieX.addEventListener("click", () => { 
    showCookiePopup(false); 
  }); 
 
  cookieOK.addEventListener("click", () => { 
    allowAllCookies(); 
  }); 
} 
 
function showCookiePopup(show: boolean = true) { 
  const cookieBox = getByID<HTMLDivElement>("vrCookieBox"); 
  const cookieModal = getByID<HTMLDivElement>("vrCookieModal"); 
  if (!cookieBox || !cookieModal) { 
    setTimeout(showCookiePopup, 50); 
    return; 
  } 
 
  if (!show) { 
    cookieBox.classList.add("vr-hidden"); 
    cookieModal.classList.add("vr-hidden"); 
    return; 
  } 
 
  cookieBox.classList.remove("vr-hidden"); 
  cookieModal.classList.remove("vr-hidden"); 
} 
 
let lastCookieClicked = 0; 
function allowAllCookies() { 
  if (lastCookieClicked >= Date.now() - globalDelay) return; 
  lastCookieClicked = Date.now(); 
  allowCookies.value = true; 
  showCookiePopup(false); 
} 
 
onMounted(() => { 
  nextTick(checkAuthorizations); 
}); 
</script> 
 
<style> 
.vr-login-box { 
  position: absolute; 
  top: 50%; 
  left: 50%; 
  transform: translate(-50%, -50%); 
  width: 300px; 
  padding: 20px; 
  background: #fff; 
  border-radius: 8px; 
  border: 1px solid rgba(0, 0, 0, 0.1); 
  box-shadow: 0 0 1px #000000bf; 
} 
 
.vr-login-header { 
  font-size: 1.3em; 
  font-weight: bold; 
  text-align: center; 
  line-height: 2em; 
} 
 
.vr-login-slogan { 
  margin: 10px 0 20px 0; 
  text-align: center; 
} 
 
.vr-login-form { 
  margin-top: 20px; 
} 
 
.vr-login-input { 
  margin-bottom: 10px; 
  padding: 8px 10px; 
  width: 100%; 
  font-size: 1.1em; 
  border-radius: 3px; 
  border: 1px solid rgba(0, 0, 0, 0.3); 
  outline: none; 
} 
 
.vr-login-message { 
  padding: 8px; 
  font-size: 0.7em; 
  background-color: rgba(255, 0, 0, 0.1); 
  border: 1px solid rgba(255, 0, 0, 0.3); 
  border-radius: 3px; 
} 
 
.vr-login-actions { 
  margin-top: 20px; 
} 
 
.vr-login-action { 
  padding: 10px; 
  text-align: center; 
  border-radius: 6px; 
  border: 1px solid rgba(0, 0, 0, 0.1); 
  cursor: pointer; 
} 
 
.vr-login-ok { 
  color: #fff; 
  background-color: #3f7d58; 
} 
.vr-login-ok:hover { 
  color: #fff; 
  background-color: #3f7d58dd; 
} 
</style>