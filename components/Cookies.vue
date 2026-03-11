<template>
  <client-only>
    <div id="vrCookieModal" class="vr-cookie-modal vr-hidden"></div>
    <div id="vrCookieBox" class="vr-cookie-box vr-hidden">
      <span id="vrCookieX" class="vr-cookie-x">✕</span>
      <div class="vr-cookie-header" >Cookies and Privacy</div>
      <div class="vr-cookie-message">
        We use cookies to ensure you get the best experience on our website.
      </div>
      <div class="vr-cookie-actions">
        <a href="/policy" class="vr-cookie-link" target="_blank">
          <div class="vr-cookie-action vr-cookie-more">Read more</div>
        </a>
        <div id="vrCookieOK" class="vr-cookie-action vr-cookie-ok">Accept all</div>
      </div>
    </div>
  </client-only>
</template>