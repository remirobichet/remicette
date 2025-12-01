import { readBody } from 'h3'
import { JSDOM } from 'jsdom'
import { ofetch } from 'ofetch'
import { promises as fs } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const { url } = await readBody(event) as { url: string }
  if (!url) return { error: 'missing url' }

  // fetch HTML
  const html = await ofetch(url, { responseType: 'text' })

  const { text } = jsDomParse(html)

  const summarizeResult = await summarize(text)

  console.error(`👀 @RR summarize`, summarizeResult)

  // Turn JSON into markdown
  const md = toMarkdown(summarizeResult)

  console.error(`👀 @RR md`, md)

  await saveMarkdown(md, summarizeResult.title)

  return { success: true }
})

const jsDomParse = (html: string) => {
  const dom = new JSDOM(html)
  const doc = dom.window.document

  const head = doc.querySelector('head')
  if (head) head.remove()

  const removeSelectors = ['script', 'style', 'link', 'noscript', 'iframe', 'meta', 'svg']
  removeSelectors.forEach(sel => {
    doc.querySelectorAll(sel).forEach(n => n.remove())
  })

  const body = doc.body
  let text = body ? body.textContent || '' : doc.textContent || ''

  text = text.replace(/\s+/g, ' ').trim()

  return { text }
}

const summarize = async (input: string) => {
  const prompt = `
You are a recipe extraction assistant.

From the following webpage text, extract a clean structured recipe.
Return ONLY valid JSON in this format:

{
  "title": "",
  "description": "",
  "image": "",
  "category": "",
  "prepTime": "",
  "cookTime": "",
  "totalTime": "",
  "servings": "",
  "ingredients": [
    {
      "quantity": "",
      "unit": "",
      "name": ""
    }
  ],
  "body": ""
}

If information is missing, leave the fields empty. Never hallucinate.

TEXT TO PARSE:
${input}
`

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.1:latest",
      prompt,
      stream: false
    })
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error("Ollama error: " + err)
  }

  const data = await response.json()
  const raw = data.response

  try {
    return JSON.parse(raw)
  } catch (err) {
    console.error("⚠️ Failed to parse Ollama JSON:", err)
    return { raw }
  }
}

type Ingredient = {
  quantity: string
  unit: string
  name: string
}

type Recipe = {
  title: string
  description: string
  image: string
  category: string
  prepTime: string
  cookTime: string
  totalTime: string
  servings: string
  ingredients: Ingredient[]
  body: string
}

const toMarkdown = (recipe: Recipe): string => {
  // frontmatter
  const frontMatter = `---
title: ${recipe.title || ""}
description: ${recipe.description || ""}
image: ${recipe.image || ""}
category: ${recipe.category || ""}
prepTime: ${recipe.prepTime || ""}
cookTime: ${recipe.cookTime || ""}
totalTime: ${recipe.totalTime || ""}
servings: ${recipe.servings || ""}
ingredients:
${recipe.ingredients?.map(i => `  - ${i.quantity} ${i.unit} ${i.name}`.trim()).join("\n") || ""}
---`

  // body text
  const body = recipe.body.trim()

  return `${frontMatter}\n\n${body}\n`
}

const slugify = (str: string) => {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9]+/g, '-')                     // replace with hyphens
    .replace(/^-+|-+$/g, '')
}

const saveMarkdown = async (markdown: string, title: string) => {
  const slug = slugify(title || "untitled-recipe")
  const filename = `${slug}.md`

  const filePath = join(process.cwd(), 'content/recipes', filename)

  await fs.writeFile(filePath, markdown, 'utf8')

  return { slug, filePath }
}
