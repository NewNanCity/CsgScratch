import appTools, { defineConfig } from '@modern-js/app-tools';

// https://modernjs.dev/en/configure/app/usage
export default defineConfig<'rspack'>({
  runtime: {
    router: true,
  },
  html: {
    disableHtmlFolder: true,
  },
  output: {
    assetPrefix: '.',
    // enableInlineScripts: true,
    enableInlineStyles: true,
    disableSourceMap: true,
    copy: [{ from: './src/media', to: './media' }],
  },
  plugins: [
    appTools({
      bundler: 'experimental-rspack',
    }),
  ],
});
