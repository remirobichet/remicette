<script setup>
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
  <!-- En-tête de la recette -->
  <div class="mb-8">
    <h1 class="text-4xl font-bold mb-6 text-gray-900">{{ recipe.title }}</h1>
    <img
      v-if="recipe.image"
      :src="recipe.image"
      :alt="recipe.title"
      class="w-full h-96 object-cover rounded-xl shadow-lg"
    >
  </div>

  <!-- Informations principales -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-lg mb-8">
    <div class="flex flex-col gap-1">
      <span class="text-xs uppercase tracking-wide text-gray-600">Catégorie</span>
      <span class="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold w-fit">
        {{ recipe.category }}
      </span>
    </div>
    <div class="flex flex-col gap-1">
      <span class="text-xs uppercase tracking-wide text-gray-600">Préparation</span>
      <span class="text-lg font-semibold text-gray-900">{{ recipe.prepTime }} min</span>
    </div>
    <div class="flex flex-col gap-1">
      <span class="text-xs uppercase tracking-wide text-gray-600">Cuisson</span>
      <span class="text-lg font-semibold text-gray-900">{{ recipe.cookTime }} min</span>
    </div>
    <div class="flex flex-col gap-1">
      <span class="text-xs uppercase tracking-wide text-gray-600">Total</span>
      <span class="text-lg font-semibold text-gray-900">{{ recipe.totalTime }} min</span>
    </div>
  </div>

  <!-- Contrôle des portions -->
  <div class="flex items-center justify-center gap-6 mb-8 p-4 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
    <button
      :disabled="currentServings <= 1"
      class="w-10 h-10 flex items-center justify-center bg-blue-600 text-white text-2xl rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      @click="decreaseServings"
    >
      −
    </button>
    <span class="text-xl font-semibold min-w-32 text-center">
      {{ currentServings }} personne{{ currentServings > 1 ? 's' : '' }}
    </span>
    <button
      class="w-10 h-10 flex items-center justify-center bg-blue-600 text-white text-2xl rounded-full hover:bg-blue-700 transition-colors"
      @click="increaseServings"
    >
      +
    </button>
  </div>

  <!-- Liste des ingrédients -->
  <div class="mb-10">
    <h2 class="text-3xl font-bold mb-6 text-gray-900 border-b-4 border-blue-600 pb-3">
      Ingrédients
    </h2>
    <ul class="space-y-2">
      <li
        v-for="(ingredient, index) in adjustedIngredients"
        :key="index"
        class="p-3 bg-gray-50 border-l-4 border-blue-600 rounded"
      >
        <span
          v-if="ingredient.quantity"
          class="font-bold text-blue-600"
        >
          {{ formatQuantity(ingredient.quantity) }}
          {{ ingredient.unit }}
        </span>
        {{ ingredient.name }}
      </li>
    </ul>
  </div>

  <!-- Instructions -->
  <div class="prose prose-lg max-w-none">
    <h2 class="text-3xl font-bold mb-6 text-gray-900 border-b-4 border-blue-600 pb-3">
      Instructions
    </h2>
    <ContentRenderer
      :value="recipe"
      class="prose dark:prose-invert prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900"
    />
  </div>
</template>
