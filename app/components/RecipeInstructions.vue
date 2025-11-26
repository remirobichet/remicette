<script setup lang="ts">
defineProps({
  recipe: {
    type: Object,
    required: true
  }
})
</script>

<template>
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
</template>