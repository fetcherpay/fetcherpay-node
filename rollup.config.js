import typescript from '@rollup/plugin-typescript';

export default [
  // ES Module build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [typescript({ tsconfig: './tsconfig.json' })],
    external: ['axios', 'crypto'],
  },
  // CommonJS build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    plugins: [typescript({ tsconfig: './tsconfig.json' })],
    external: ['axios', 'crypto'],
  },
];
