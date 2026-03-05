const config = {
  '**/*.(ts|tsx)': () => 'bun run tsc --noEmit',

  '**/*.(ts|tsx|js|cjs|mjs|jsx|astro)': (filenames) => [
    `bunx eslint --fix ${filenames.join(' ')}`,
    `bunx prettier --write ${filenames.join(' ')}`,
  ],

  '**/*.css': (filenames) => [
    `bunx stylelint --fix ${filenames.join(' ')}`,
    `bunx prettier --write ${filenames.join(' ')}`,
  ],

  '**/*.(md|json)': (filenames) =>
    `bunx prettier --write ${filenames.join(' ')}`,
};

module.exports = config;
