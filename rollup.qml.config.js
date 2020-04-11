import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';


export default {
  input: 'src/dictionary.ts',
  inlineDynamicImports: true,
  output: {
    file: 'dist/sdapi.dictionary.qml.js',
    format: 'cjs',
    esModule: false,
    intro: 'const module = {};',  // A hack for QML environment
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: false
    })
  ]
};
