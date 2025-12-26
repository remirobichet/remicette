<script setup lang="ts">
import type { PropType } from 'vue'

type Ingredient = {
  name: string
  unit?: string
  quantity?: number
}

defineProps({
  ingredients: {
    type: Array as PropType<Ingredient[]>,
    required: true
  }
})


const formatQuantity = (quantity: number) => {
  // Arrondir à 1 décimale si nécessaire
  return Math.round(quantity * 10) / 10
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-2xl flex items-center gap-2">
        <Icon
          name="wheat"
          class="h-6 w-6"
        />
        Ingrédients
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ul class="space-y-3">
        <li
          v-for="(ingredient, index) in ingredients"
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
</template>