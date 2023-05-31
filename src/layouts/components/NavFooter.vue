<template>
  <div class="h-10 bg-gray-100 dark:bg-[#171d30] w-full"></div>
  <footer
    class="footer items-center h-10 text-sm bg-gray-100 dark:bg-[#171d30] fixed bottom-0 pr-14 pl-4 z-10"
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
      class="grid-flow-col gap-4 md:!place-self-end lg:!place-self-center hidden sm:!grid"
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
