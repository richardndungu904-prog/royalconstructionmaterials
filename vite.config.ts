import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import netlify from '@netlify/vite-plugin-tanstack-start'

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true'
const base = isGitHubPages ? '/royalconstructionmaterials/' : '/'

const config = defineConfig({
  base,
  plugins: [
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    ...(isGitHubPages ? [] : [netlify()]),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
