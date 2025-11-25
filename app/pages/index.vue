<script setup lang="ts">
// Fetch recipes
const { data: recipes } = await useAsyncData('all-recipes', () => {
  return queryCollection('content').all()
})

// Derive categories from recipes
const categories = computed(() => {
  const set = new Set((recipes.value || []).map(r => r.category))
  return Array.from(set)
})

const search = ref('')
const category = ref('')

const filteredRecipes = computed(() => {
  return (recipes.value || []).filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.value.toLowerCase())
    const matchesCat = category.value ? r.category === category.value : true
    return matchesSearch && matchesCat
  })
})
</script>

<template>
  <div class="relative pt-4 px-4 max-w-3xl mx-auto">
    <!-- Title -->
    <h1 class="text-4xl font-bold mb-6 text-center">🧑‍🍳 Mes Recettes</h1>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6 justify-center">
      <input
        v-model="search"
        type="text"
        placeholder="Rechercher..."
        class="border px-3 py-2 rounded w-full sm:w-1/2"
      >

      <select
        v-model="category"
        class="border px-3 py-2 rounded w-full sm:w-1/3"
      >
        <option value="">Toutes catégories</option>
        <option
          v-for="c in categories"
          :key="c"
          :value="c"
        >{{ c }}</option>
      </select>
    </div>

    <!-- Recipe list -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <NuxtLink
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        class="p-4 border rounded-lg hover:shadow transition cursor-pointer"
        :to="recipe.path"
      >
        <h2 class="text-xl font-semibold">{{ recipe.title }}</h2>
        <p class="text-sm opacity-75">{{ recipe.category }}</p>
      </NuxtLink>
    </div>
  </div>
</template>
