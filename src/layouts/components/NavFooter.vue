<template>
  <!-- footer -->
  <footer
    class="flex items-center h-12 mt-5 text-sm bg-[#ffffff] dark:bg-[#222222] py-2 z-10 w-full"
  >
    <div class="flex flex-1">
      &copy;&nbsp;
      {{ new Date().getFullYear() }}&nbsp;
      Made With &nbsp;
      <img src="../../assets/images/heart.svg" />&nbsp;
      By &nbsp;
      <a
        class="link text-primary text-base no-underline"
        href="https://ping.pub"
        target="_blank"
        rel="noopener noreferrer"
        >ping.pub</a
      >
    </div>
  </footer>
</template>