import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipesService } from './recipes.service';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    if (createRecipeDto.code !== process.env.POST_SECRET) {
      throw new HttpException(
        "C'est pas le bon code 😎",
        HttpStatus.UNAUTHORIZED,
      );
    }
    // Call the service (dummy for now)
    const result = await this.recipesService.createRecipe(createRecipeDto.url);
    return { success: true, data: result };
  }
}
