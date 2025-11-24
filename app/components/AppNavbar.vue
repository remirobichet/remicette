<script setup lang="ts">
const { data: navigation } = await useAsyncData('navigation', () =>
  queryCollectionNavigation('content'),
);
</script>

<template>
  <div class="flex justify-between px-4 py-4 mx-auto sm:px-8 max-w-2xl">
    <!-- Navigation -->
    <div class="text-gray-700 dark:text-gray-200">
      <NuxtLink
        v-for="link in navigation"
        :key="link.path"
        class="mr-6"
        :to="link.path"
        active-class="font-bold"
      >{{ link.title }}</NuxtLink>
    </div>
  </div>
</template>
