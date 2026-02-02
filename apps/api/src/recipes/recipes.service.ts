import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JSDOM } from 'jsdom';
import { promises as fs } from 'fs';
import { join } from 'path';
import Replicate from 'replicate';

type Ingredient = {
  quantity: string;
  unit: string;
  name: string;
};

type Recipe = {
  title: string;
  description: string;
  image: string;
  category: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: string;
  ingredients: Ingredient[];
  body: string;
};

@Injectable()
export class RecipesService {
  constructor(private configService: ConfigService) { }

  async createRecipe(url: string) {
    if (!url) {
      throw new HttpException('URL is required', HttpStatus.BAD_REQUEST);
    }

    try {
      // 1️⃣ Fetch HTML
      const res: Response = await fetch(url);
      const html: string = await res.text();
      const { text } = this.parseHTML(html);

      // 2️⃣ Call Replicate
      const recipe = await this.summarize(text);

      // 3️⃣ Convert to markdown
      const md = this.toMarkdown(recipe);

      // 4️⃣ Save markdown
      const saved = await this.saveMarkdown(md, recipe.title);

      return { success: true, ...saved, recipe };
    } catch (err: any) {
      if (err instanceof Error) {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      } else {
        throw new HttpException(
          'Unknown error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  private parseHTML(html: string) {
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const head = doc.querySelector('head');
    if (head) head.remove();

    const removeSelectors = [
      'script',
      'style',
      'link',
      'noscript',
      'iframe',
      'meta',
      'svg',
    ];
    removeSelectors.forEach((sel) =>
      doc.querySelectorAll(sel).forEach((n) => n.remove()),
    );

    let text = doc.body?.textContent || doc.textContent || '';
    text = text.replace(/\s+/g, ' ').trim();
    return { text };
  }

  private async summarize(input: string): Promise<Recipe> {
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
`;

    const replicateToken = this.configService.get<string>(
      'REPLICATE_API_TOKEN',
    );

    if (!replicateToken) {
      throw new HttpException(
        'Replicate configuration missing',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const output = await replicate.run('openai/gpt-5-mini', {
      input: {
        prompt,
        temperature: 0.2,
        max_tokens: 1500,
      },
    });

    const raw = Array.isArray(output)
      ? output.join('')
      : typeof output === 'string'
        ? output
        : JSON.stringify(output);

    console.error(`👀 @RR raw`, raw);
    // Defensive JSON extraction
    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new HttpException(
        '⚠️ No JSON detected from Replicate',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const jsonString = raw.slice(jsonStart, jsonEnd + 1);

    try {
      return JSON.parse(jsonString) as Recipe;
    } catch (err: unknown) {
      // Safely extract error message
      const message = err instanceof Error ? err.message : String(err);
      throw new HttpException(
        `⚠️ Failed to parse Replicate JSON: ${message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private toMarkdown(recipe: Recipe): string {
    const frontMatter = `---
title: ${recipe.title || ''}
description: ${recipe.description || ''}
image: ${recipe.image || ''}
category: ${recipe.category || ''}
prepTime: ${recipe.prepTime || ''}
cookTime: ${recipe.cookTime || ''}
totalTime: ${recipe.totalTime || ''}
servings: ${recipe.servings || ''}
ingredients:
${recipe.ingredients?.map((i) => `  - ${i.quantity} ${i.unit} ${i.name}`.trim()).join('\n') || ''}
---`;

    const body = recipe.body?.trim() || '';
    return `${frontMatter}\n\n${body}\n`;
  }

  private slugify(str: string) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async saveMarkdown(markdown: string, title: string) {
    const slug = this.slugify(title || 'untitled-recipe');
    if (!process.env.REPO_ROOT) {
      throw new HttpException(
        `⚠️ Missing repo root path`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const filePath = join(
      process.env.REPO_ROOT,
      '/apps/web/content',
      `${slug}.md`,
    );
    await fs.writeFile(filePath, markdown, 'utf8');
    return { slug, filePath };
  }
}
