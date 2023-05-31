<template>
  <div class="h-10 bg-gray-100 dark:bg-[#171d30] w-full"></div>
  <!-- footer -->
  <footer
    class="flex sm:!flex-row flex-col items-center h-10 text-sm bg-gray-100 dark:bg-[#171d30] py-2 z-10 w-full"
  >
  <!-- items-center grid-flow-col -->
    <div class="flex flex-1">
      &copy;&nbsp;
      {{ new Date().getFullYear() }}&nbsp;
      Made With&nbsp;
      <img src="../../assets/images/heart.svg" />&nbsp;
      By&nbsp;
      <a
        class="link link-primary no-underline"
        href="https://ping.pub"
        target="_blank"
        rel="noopener noreferrer"
        >Ping.pub</a
      >
    </div>
    <!-- grid-flow-col gap-4 sm:!place-self-center hidden sm:!grid -->
    <div
      class="flex "
    >
      <a
        class="link link-primary no-underline mr-4"
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
display: grid;
width: 100%;
grid-auto-flow: row;
place-items: start;
row-gap: 2.5rem;
-moz-column-gap: 1rem;
column-gap: 1rem;
font-size: 0.875rem;
line-height: 1.25rem;