<script setup lang="ts">
import misc404 from '@/assets/images/pages/404.png';
</script>

<template>
    <div class="pt-10">
        <div class="text-center">
            <div class="text-8xl font-semibold text-main">404</div>
            <div class="text-xl font-bold my-2">Page Not Found</div>
            <div class="text-base">
                We couldn't find the page you are looking for.
            </div>
        </div>

        <!-- 👉 Image -->
        <div class="misc-avatar w-full text-center">
            <RouterLink to="/" class="btn no-underline btn-primary mt-4">
                Back to Home
            </RouterLink>
            <img :src="misc404" alt="Coming Soon" class="mx-auto h-[400px] mt-10" />
        </div>
    </div>
</template>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
</route>
