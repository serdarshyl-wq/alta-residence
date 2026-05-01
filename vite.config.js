import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import obfuscator from 'vite-plugin-javascript-obfuscator'

// https://vite.dev/config/
export default defineConfig({
  // Disable Vite's esbuild minifier so it doesn't re-mangle the obfuscated names back
  // to short identifiers. javascript-obfuscator's `compact: true` handles compaction.
  build: {
    minify: false,
  },
  plugins: [
    react(),
    tailwindcss(),
    obfuscator({
      apply: 'build', // production build only — dev keeps fast HMR
      include: ['**/*.js', '**/*.jsx'],
      exclude: [/node_modules/],
      options: {
        compact: true,
        // disabled per request: switch-case control flow + while-loop debug protection
        controlFlowFlattening: false,
        debugProtection: false,
        debugProtectionInterval: 0,
        deadCodeInjection: false,
        identifierNamesGenerator: 'hexadecimal',
        renameGlobals: false,
        // selfDefending breaks under Vercel's brotli/gzip pipeline (false-positive "modified
        // code detected") and can cause a blank-screen hang in production.
        selfDefending: false,
        simplify: true,
        splitStrings: true,
        splitStringsChunkLength: 10,
        stringArray: true,
        stringArrayEncoding: ['base64'],
        stringArrayThreshold: 0.75,
        // transformObjectKeys can break libraries that rely on literal property access
        // (React/GSAP internals); leave off to avoid runtime errors in production.
        transformObjectKeys: false,
        unicodeEscapeSequence: false,
      },
    }),
  ],
})
