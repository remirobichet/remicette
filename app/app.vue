<script setup lang="ts">
useSeoMeta({
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="sm:pt-6 sm:pb-10">
    <Html lang="fr" />
    <NuxtLoadingIndicator />
    <NuxtPage />
    <!-- Color switch top right -->
    <div class="absolute top-2 right-2">
      <ColorModeSwitch />
    </div>
  </div>
</template>
