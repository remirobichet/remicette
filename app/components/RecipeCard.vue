<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ContentCollectionItem } from '@nuxt/content'

const props = defineProps<{
  recipe: ContentCollectionItem
}>()

const currentServings = ref(props.recipe.servings || 4)

const adjustedIngredients = computed(() => {
  const ratio = currentServings.value / props.recipe.servings

  return props.recipe.ingredients?.map(ingredient => ({
    ...ingredient,
    quantity: ingredient.quantity ? ingredient.quantity * ratio : null
  }))
})

const increaseServings = () => {
  currentServings.value++
}

const decreaseServings = () => {
  if (currentServings.value > 1) {
    currentServings.value--
  }
}

/* View mode */
type ViewMode = 'normal' | 'ingredients' | 'instructions'

const viewMode = ref<ViewMode>('normal')

const setViewMode = (mode: ViewMode) => {
  viewMode.value = viewMode.value === mode ? 'normal' : mode
}
</script>

<template>
  <div class="space-y-6 pb-20">
    <template v-if="viewMode === 'normal'">
      <div class="flex gap-5 items-center mb-6">
        <NuxtLink
          class="cursor-pointer"
          to="/"
        >
          <Icon
            name="back"
            size="2em"
          />
        </NuxtLink>
        <h1 class="text-4xl font-bold text-primary">{{ recipe.title }}</h1>
      </div>
      <!-- Image de la recette -->
      <div
        v-if="recipe.image"
        class="relative overflow-hidden rounded-lg"
      >
        <img
          :src="recipe.image"
          :alt="recipe.title"
          class="w-full h-72 md:h-96 object-cover"
        >
      </div>

      <!-- Informations principales -->
      <Card>
        <CardContent>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2 text-muted-foreground">
                <Icon
                  name="chef-hat"
                  class="h-4 w-4"
                />
                <span class="text-xs uppercase tracking-wide">Catégorie</span>
              </div>
              <Badge
                variant="secondary"
                class="w-fit"
              >
                {{ recipe.category }}
              </Badge>
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2 text-muted-foreground">
                <Icon
                  name="clock"
                  class="h-4 w-4"
                />
                <span class="text-xs uppercase tracking-wide">Préparation</span>
              </div>
              <span class="text-lg font-semibold">{{ recipe.prepTime }} min</span>
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2 text-muted-foreground">
                <Icon
                  name="timer"
                  class="h-4 w-4"
                />
                <span class="text-xs uppercase tracking-wide">Cuisson</span>
              </div>
              <span class="text-lg font-semibold">{{ recipe.cookTime }} min</span>
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2 text-muted-foreground">
                <Icon
                  name="clock"
                  class="h-4 w-4"
                />
                <span class="text-xs uppercase tracking-wide">Total</span>
              </div>
              <span class="text-lg font-semibold">{{ recipe.totalTime }} min</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Contrôle des portions -->
      <Card>
        <CardContent>
          <div class="flex items-center justify-center gap-4">
            <Button
              :disabled="currentServings <= 1"
              variant="outline"
              size="icon"
              aria-label="Diminuer les portions"
              @click="decreaseServings"
            >
              <Icon
                name="minus"
                class="h-4 w-4"
              />
            </Button>

            <div class="flex items-center gap-2 min-w-[140px] justify-center">
              <Icon
                name="users"
                class="h-5 w-5 text-muted-foreground"
              />
              <span class="text-xl font-semibold">
                {{ currentServings }} personne{{ currentServings > 1 ? 's' : '' }}
              </span>
            </div>

            <Button
              variant="outline"
              size="icon"
              aria-label="Augmenter les portions"
              @click="increaseServings"
            >
              <Icon
                name="plus"
                class="h-4 w-4"
              />
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Liste des ingrédients -->
      <RecipeIngredients :ingredients="adjustedIngredients" />

      <!-- Instructions -->
      <RecipeInstructions :recipe />
    </template>

    <template v-if="viewMode === 'ingredients'">
      <RecipeIngredients :ingredients="adjustedIngredients" />
    </template>

    <template v-if="viewMode === 'instructions'">
      <RecipeInstructions :recipe />
    </template>
  </div>

  <!-- Bottom fixed action bar -->
  <div class="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-4 flex justify-around items-center">
    <Button
      size="icon"
      variant="secondary"
      @click="setViewMode('ingredients')"
    >
      <Icon
        v-if="viewMode === 'ingredients'"
        name="close"
      />
      <Icon
        v-else
        name="wheat"
      />
    </Button>

    <Button
      size="icon"
      variant="secondary"
      @click="setViewMode('instructions')"
    >
      <Icon
        v-if="viewMode === 'instructions'"
        name="close"
      />
      <Icon
        v-else
        name="list-todo"
      />
    </Button>

    <Button variant="outline">
      Hands-free
    </Button>
  </div>

</template>