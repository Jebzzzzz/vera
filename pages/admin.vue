<script lang="ts"></script>

<template>
  <client-only>
    <NavBar :navAdminMode="navAdminMode" />
    <div id="vrMain" class="vr-main">
      <span id="vrSimpleHello" class="vr-simple-hello vr-hidden">
        Hello, {{ fullName }}!
      </span>
    </div>
    <Cookies />
    <Copyright />
  </client-only>
</template>

<script setup lang="ts">
//import { useSeoMeta, useHead } from "@vueuse/head";
import { useRouter } from "vue-router";

const title = "VERA";
const description =
  "Vera is an automated fact-checking platform that allows users to verify the accuracy of online articles, URLs, and headlines in real-time.";

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

/* Cookies */
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

/* Access Control */
const router = useRouter();
let navAdminMode = userLevel.value >= 2 ? "vr-nav-admin" : "";

function getByID<T extends HTMLElement>(id: string) {
  return document.getElementById(id) as T;
}

function checkAuthorizations() {
  if (!accessToken.value) {
    router.push("/login");
  } else if (userLevel.value < 2) {
    router.push("/");
  }
  const navBasic = getByID<HTMLDivElement>("vrNavBasic");
  const navAdmin = getByID<HTMLDivElement>("vrNavAdmin");
  const navLogout = getByID<HTMLDivElement>("vrNavAdminLogout");
  const simpleHello = getByID<HTMLSpanElement>("vrSimpleHello");
  if (!navBasic || !navAdmin || !navLogout || !simpleHello) return;
  navLogout.addEventListener("click", () => {
    retries.value = 0;
    username.value = "";
    accessToken.value = "";
    userLevel.value = -1;
    fullName.value = "";
    router.push("/login");
  });
  navBasic.remove();
  navAdmin.classList.remove("vr-hidden");
  simpleHello.classList.remove("vr-hidden");
  loadModal();
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
    setTimeout(() => showCookiePopup(show), 50);
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
  nextTick(() => {
    checkAuthorizations();
  });
});
</script>

<style>
.vr-nav-admin {
  background-color: #ec5228 !important;
}
.vr-nav-admin a,
.vr-nav-admin span {
  color: #fff !important;
}
.vr-nav-admin .vr-nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
.vr-nav-admin .vr-nav-home:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
.vr-nav-admin .vr-nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  cursor: pointer;
}
.vr-simple-hello {
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
</style>
