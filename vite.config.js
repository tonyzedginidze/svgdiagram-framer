import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import framer from 'vite-plugin-framer';
import mkcert from 'vite-plugin-mkcert';
import { resolve } from 'node:path';

const web = resolve(import.meta.dirname, 'shared/app');
export default defineConfig({
  plugins: [{ name: 'shared-maker-imports', enforce: 'pre', transform(source, id) {
    if (!id.startsWith(web) || !id.endsWith('.vue')) return;
    const names = [...new Set([...source.matchAll(/<FeaturesTools(\w+)/g)].map(match => match[1]))];
    return source.replace('<script setup>', `<script setup>\nimport { computed } from 'vue';\n${names.map(name => `import FeaturesTools${name} from '${web}/components/features/tools/${name}.vue';`).join('\n')}`);
  } }, vue(), mkcert(), framer()],
  resolve: { alias: { '~': web, '@': web, '@svgdiagram/diagram/web': resolve(import.meta.dirname, 'shared/diagram/web.js') } }
});
