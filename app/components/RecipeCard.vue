<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  recipe: {
    type: Object,
    required: true
  }
})

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

const formatQuantity = (quantity) => {
  // Arrondir à 1 décimale si nécessaire
  return Math.round(quantity * 10) / 10
}
</script>

<template>
  <div class="space-y-6">
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
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl flex items-center gap-2">
          <Icon
            name="chef-hat"
            class="h-6 w-6"
          />
          Ingrédients
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul class="space-y-3">
          <li
            v-for="(ingredient, index) in adjustedIngredients"
            :key="index"
            class="flex items-start gap-3 p-3 rounded-md bg-muted/50 border-l-4 border-primary"
          >
            <div class="flex-1">
              <span
                v-if="ingredient.quantity"
                class="font-semibold text-primary"
              >
                {{ formatQuantity(ingredient.quantity) }}
                {{ ingredient.unit }}
              </span>
              <span :class="ingredient.quantity ? 'ml-1' : ''">
                {{ ingredient.name }}
              </span>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>

    <!-- Instructions -->
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl flex items-center gap-2">
          <Icon
            name="timer"
            class="h-6 w-6"
          />
          Instructions
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <ContentRenderer
          :value="recipe"
          class="prose prose-sm md:prose-base max-w-none dark:prose-invert"
        />
      </CardContent>
    </Card>
  </div>
</template>