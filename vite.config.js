import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import obfuscator from 'vite-plugin-javascript-obfuscator'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  // Disable Vite's esbuild minifier so it doesn't re-mangle the obfuscated names back
  // to short identifiers. javascript-obfuscator's `compact: true` handles compaction.
  build: {
    minify: false,
  },
  plugins: [
    react(),
    tailwindcss(),
    // The SSR bundle only ever runs on our own build machine (to produce
    // prerendered HTML) — it never ships to a browser, so there's nothing to
    // protect by obfuscating it, only risk: each `vite build` invocation
    // obfuscates independently with randomized identifier/string encoding,
    // and a subtle transform bug there was a real suspect behind a
    // hydration mismatch we chased for a while. Keep it client-only.
    !isSsrBuild && obfuscator({
      apply: 'build', // production build only — dev keeps fast HMR
      include: ['**/*.js', '**/*.jsx'],
      // App.jsx is excluded because its string obfuscation would rewrite any
      // dynamic import() specifiers into runtime-computed values, which stops
      // Rollup from statically resolving them for code-splitting.
      exclude: [/node_modules/, /[\\/]App\.jsx$/],
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
}))
