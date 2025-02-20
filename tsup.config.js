import {defineConfig} from 'tsup';

export default defineConfig({
  entry: ['./lib/**/*.ts', '!./lib/**/*.test.ts'],
  outDir: './build',
  dts: true,
  treeshake: true,
  tsconfig: './tsconfig.json',
  format: ['esm', 'cjs'],
  clean: true,
  keepNames: true,
});
