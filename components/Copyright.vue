<script setup lang="ts">
  const year = new Date().getFullYear();
</script>

<template>
  <client-only>
    <footer class="vr-footer-area">
      <nav class="vr-footer-links">
        <a href="/terms">Terms of Service</a>
        <span>&nbsp;|&nbsp;</span>
        <a href="/policy">Privacy Policy</a>
        <span>&nbsp;|&nbsp;</span>
        <a href="/support">Support</a>
      </nav>
      <div class="vr-footer-copyright">
        <span>&copy;&nbsp;</span>
        <span>{{ year }}</span>
        <span>&nbsp;Vera Intelligence. All rights reserved.</span>
      </div>
    </footer>
  </client-only>
</template>