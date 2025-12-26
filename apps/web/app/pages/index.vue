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
  <div class="relative pt-8 px-4 max-w-4xl mx-auto pb-12">
    <!-- Title -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-2">🧑‍🍳 Mes Recettes</h1>
      <p class="text-muted-foreground">Découvrez et filtrez vos recettes préférées</p>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4 mb-8">
      <div class="flex-1">
        <Input
          v-model="search"
          type="text"
          placeholder="Rechercher une recette..."
          class="w-full"
        />
      </div>

      <div class="sm:w-64">
        <Select v-model="category">
          <SelectTrigger>
            <SelectValue placeholder="Toutes catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="c in categories"
              :key="c"
              :value="c"
            >
              {{ c }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Recipe count -->
    <div class="mb-4 text-sm text-muted-foreground">
      {{ filteredRecipes.length }} recette{{ filteredRecipes.length > 1 ? 's' : '' }} trouvée{{ filteredRecipes.length >
        1 ? 's' : '' }}
    </div>

    <!-- Recipe list -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <NuxtLink
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        :to="recipe.path"
        class="block transition-transform hover:scale-102"
      >
        <Card class="h-full hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle class="text-xl">{{ recipe.title }}</CardTitle>
            <CardDescription>
              <Badge
                variant="secondary"
                class="mt-2"
              >
                {{ recipe.category }}
              </Badge>
            </CardDescription>
          </CardHeader>
        </Card>
      </NuxtLink>
    </div>

    <!-- Empty state -->
    <div
      v-if="filteredRecipes.length === 0"
      class="text-center py-12"
    >
      <p class="text-muted-foreground text-lg">Aucune recette trouvée</p>
      <p class="text-sm text-muted-foreground mt-2">Essayez de modifier vos filtres</p>
    </div>
  </div>
</template>