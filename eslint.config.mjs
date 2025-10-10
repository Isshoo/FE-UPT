import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
  },
  ...compat.extends('next/core-web-vitals', 'prettier'),
  {
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': 'error',
      semi: ['error', 'always'],
    },
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'src/components/ui/**',
      'public/**',
    ],
  },
];

export default eslintConfig;
