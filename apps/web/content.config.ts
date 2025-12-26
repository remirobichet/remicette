import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    /**
     * This is collection for content-wind theme
     * Create `content.config.ts` in project root to overwrite this
     */
    content: defineCollection({
      type: 'page',
      source: '**',
      schema: z.object({
        layout: z.string(),
        title: z.string(),
        description: z.string(),
        image: z.string(),
        category: z.string(),
        prepTime: z.number(),
        cookTime: z.number(),
        totalTime: z.number(),
        servings: z.number(),
        ingredients: z.array(
          z.object({
            quantity: z.number(),
            unit: z.string(),
            name: z.string(),
          })
        ),
      }),
    }),
  },
})
