<template>
  <footer
    class="footer items-center pt-4  pb-8 text-sm bg-gray-100 dark:bg-[#171d30] sticky bottom-0 z-10 mt-8"
  >
    <div class="items-center grid-flow-col">
      &copy;
      {{ new Date().getFullYear() }}
      Made With
      <img src="../../assets/images/heart.svg" />
      By
      <a
        class="link link-primary no-underline"
        href="https://ping.pub"
        target="_blank"
        rel="noopener noreferrer"
        >Ping.pub</a
      >
    </div>
    <div
      class="grid-flow-col gap-4 md:!place-self-center md:!justify-self-end hidden md:!grid"
    >
      <a
        class="link link-primary no-underline"
        href="https://github.com/ping-pub/explorer/blob/master/LICENSE"
        target="noopener noreferrer"
        >License</a
      >
      <a
        class="link link-primary no-underline"
        href="https://github.com/ping-pub/explorer"
        target="noopener noreferrer"
        >Github</a
      >
    </div>
  </footer>
</template>
