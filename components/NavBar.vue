<template>
  <client-only>
    <header :class="['vr-navbar', navAdminMode]">
      <nav class="vr-nav-left">
        <a href="/" class="vr-nav-home">
          <img src="/logo.png" width="20" height="20" class="vr-nav-logo" />
          <span>VERA</span>
        </a>
      </nav>
      <nav id="vrNavBasic" class="vr-nav-right vr-hidden">
        <ul>
          <li><a href="#" class="vr-nav-link">Headline Check</a></li>
          <li><a href="#" class="vr-nav-link">Rumor Filter</a></li>
          <li><a href="#" class="vr-nav-link">Safety Check</a></li>
          <li><span id="vrNavBasicLogout" class="vr-nav-link">Logout</span></li>
        </ul>
      </nav>
      <nav id="vrNavAdmin" class="vr-nav-right vr-hidden">
        <ul>
          <li><a href="#" class="vr-nav-link">Settings</a></li>
          <li><a href="#" class="vr-nav-link">Reports</a></li>
          <li><span id="vrNavAdminLogout" class="vr-nav-link">Logout</span></li>
        </ul>
      </nav>
    </header>
  </client-only>
</template>

<script setup lang="ts">
const props = defineProps<{ navAdminMode: string }>();
</script>
