<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(`page-${route.params.slug}`, () => {
  return queryCollection('content').path(route.path).first()
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
  })
}

useSeoMeta(page.value?.seo || {})
</script>

<template>
  <NuxtLayout :name="page?.layout || 'default'">
    <RecipeCard :recipe="page" />
  </NuxtLayout>
</template>
