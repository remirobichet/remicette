<script setup lang="ts">
import { Button } from '@/components/ui/button'

const colorMode = useColorMode()
const onColorModeClick = (mode: 'light' | 'dark') => (colorMode.value = mode)
</script>

<template>
  <nav class="absolute top-2 right-2 flex items-center gap-2">
    <!-- Mobile menu with dropdown -->
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="ghost"
            size="icon"
          >
            <Icon name="menu" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent class="mr-2">
          <DropdownMenuItem>
            <NuxtLink
              to="/"
              class="w-full"
            >Accueil</NuxtLink>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <NuxtLink
              to="/upload"
              class="w-full"
            >Upload</NuxtLink>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem @click="onColorModeClick('light')">
            <ColorScheme placeholder="...">
              <Icon
                name="light-mode"
                class="w-5 h-5"
              />
              Light
              <span class="sr-only">Light Mode</span>
            </ColorScheme>
          </DropdownMenuItem>

          <DropdownMenuItem @click="onColorModeClick('dark')">
            <ColorScheme placeholder="...">
              <Icon
                name="dark-mode"
                class="w-5 h-5"
              />
              Dark
              <span class="sr-only">Dark Mode</span>
            </ColorScheme>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </nav>
</template>
