<template>
  <!-- footer -->
  <footer
    class="flex items-center h-12 mt-5 text-sm bg-gray-100 dark:bg-[#2E2E2E] py-2 z-10 w-full"
  >
    <div class="flex flex-1">
      Ⓕ&nbsp;
      {{ new Date().getFullYear() }}&#160Fork everything with&#160
      <img src="../../assets/images/heart.svg" />
      by&nbsp;
      <a
        class="link"
        href="https://ping.pub"
        target="_blank"
        rel="noopener noreferrer"
        >Ping.pub</a
      >
      &#160forked by&#160
      <a
        class="link"
        href="https://posthuman.digital/"
        target="_blank"
        rel="noopener noreferrer"
        >POSTHUMAN ꝏ DVS</a>
    </div>
    <div
      class="hidden md:!block"
    >
      <a
        class="link mr-4"
        href="https://github.com/ping-pub/explorer/blob/master/LICENSE"
        target="noopener noreferrer"
        >License</a
      >
      <a
        class="link"
        href="https://github.com/ping-pub/explorer"
        target="noopener noreferrer"
        >Github</a
      >
    </div>
  </footer>
</template>