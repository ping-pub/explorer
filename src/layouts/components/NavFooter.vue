<script setup lang="ts">
</script>
<template>
  <!-- footer -->
  <footer class="bg-[#0d2fb8] dark:bg-[#00125b;] text-white px-4 py-14 md:py-10" role="contentinfo">
    <div class="max-w-[1200px] mx-auto">
      <!-- Top row: logo | social -->
      <div class="flex flex-row justify-between items-center">
        <!-- Left: Logo -->
        <a href="/" aria-label="Pocket Network" class="flex-shrink-0">
          <img src="https://pocket.network/wp-content/uploads/2025/01/logo-white.png" alt="Pocket Network"
            class="h-11 w-auto" />
        </a>

        <!-- Center: Social icons -->
        <nav class="flex gap-6 items-center" aria-label="Social links">
          <a href="https://discord.gg/pocket-network" target="_blank">
            <i class="fa-brands fa-discord text-[2rem]"></i>
          </a>
          <a href="https://x.com/POKTnetwork" target="_blank">
            <i class="fa-brands fa-twitter text-[2rem]"></i>
          </a>
          <a href="https://www.linkedin.com/company/pocket-network-foundation/" target="_blank">
            <i class="fa-brands fa-linkedin text-[2rem]"></i>
          </a>
        </nav>
      </div>

      <!-- Powered by + legal links -->
      <div class="flex flex-row justify-between items-center mt-4">
        <!-- <p class="text-white/85 text-[0.95rem]">
          Powered by
          <a href="https://stakenodes.org" target="_blank" class="inline-flex items-center gap-1">
            <img src="https://stakenodes.org/favicon.png" alt="Stakenodes" class="h-5" />
            <span class="text-base">Stakenodes</span>
          </a>
        </p> -->
        <p class="pokt-footer__copy flex flex-row items-center justify-center">
          <span>Powered by</span> <a class="flex flex-row items-center gap-1 ml-2" href="https://stakenodes.org" target="_blank"><img alt="https://stakenodes.org"
              src="https://stakenodes.org/favicon.png" style="height:1.2rem;" /><span
              style="font-size: 1rem;">Stakenodes</span></a>
        </p>

        <div class="flex gap-6 text-white text-base mt-[22px] mb-[18px]">
          <a href="https://pocket.network/privacy-policy/" class="hover:underline underline-offset-2">
            Privacy Statement
          </a>
          <a href="https://pocket.network/terms-of-use/" class="hover:underline underline-offset-2">
            Terms of Service
          </a>
        </div>
      </div>

      <!-- Bottom row: copyright + nav -->
      <div class="flex flex-row justify-between items-center mt-4">
        <p class="text-white/85 text-[0.95rem]">
          © <span id="currentYear"></span> Pocket Network. All rights reserved.
        </p>

        <nav class="flex flex-wrap justify-center gap-x-6 gap-y-4 text-[0.98rem]" aria-label="Footer">
          <a target="_blank" href="https://forum.pokt.network/" class="hover:underline underline-offset-2">Forum</a>
          <a target="_blank" href="https://explorer.pocket.network/"
            class="hover:underline underline-offset-2">Explorer</a>
          <a target="_blank" href="https://docs.pokt.network/" class="hover:underline underline-offset-2">Docs</a>
          <a target="_blank" href="https://pocket.network/press-kit/" class="hover:underline underline-offset-2">Press
            Kit</a>
          <a target="_blank" href="https://github.com/pokt-network"
            class="hover:underline underline-offset-2">GitHub</a>
          <a target="_blank" href="https://wallet.pocket.network/" class="hover:underline underline-offset-2">Wallet</a>
          <a target="_blank" href="https://coinmarketcap.com/currencies/pocket-network/markets/"
            class="hover:underline underline-offset-2">Buy</a>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script setup>
onMounted(() => {
  const yearEl = document.getElementById("currentYear")
  if (yearEl) yearEl.textContent = new Date().getFullYear()
})
</script>
