<script setup lang="ts">
import { ref } from 'vue'

const config = useRuntimeConfig()

const url = ref('')
const code = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

// Fake handler — replace with your call later
async function handleSubmit() {
  error.value = null
  success.value = null

  if (!url.value.trim()) {
    error.value = "Veuillez entrer une URL."
    return
  }

  loading.value = true
  try {
    await $fetch(`${config.public.apiUrl}/recipes`, { method: 'POST', body: { url: url.value, code: code.value } })
    success.value = "URL soumise avec succès ! (simulation)"
  } catch (e) {
    console.error(e)
    error.value = "Une erreur est survenue."
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex justify-center pt-20 px-4">
    <Card class="w-full max-w-lg">
      <CardHeader>
        <CardTitle class="text-xl font-semibold">
          Importer une recette via URL
        </CardTitle>
      </CardHeader>

      <CardContent class="space-y-4">
        <form
          class="space-y-3"
          @submit.prevent="handleSubmit"
        >
          <Input
            v-model="url"
            placeholder="https://exemple.com/ma-recette"
            type="url"
          />

          <Input
            v-model="code"
            placeholder="Password"
            type="password"
          />

          <Button
            type="submit"
            class="w-full"
            :disabled="loading"
            :size="!loading ? 'default' : 'icon'"
          >
            <span v-if="!loading">Soumettre</span>
            <Icon
              v-else
              class="animate-spin h-4 w-4 mx-auto"
              name="loader"
            />
          </Button>
        </form>

        <!-- Errors -->
        <p
          v-if="error"
          class="text-sm text-red-600"
        >{{ error }}</p>

        <!-- Success -->
        <p
          v-if="success"
          class="text-sm text-green-600"
        >{{ success }}</p>
      </CardContent>
    </Card>
  </div>
</template>
