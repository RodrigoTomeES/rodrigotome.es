const config = {
  '**/*.(ts|tsx)': () => 'bun run tsc --noEmit',

  '**/*.(ts|tsx|js|cjs|mjs|jsx|astro)': (filenames) => [
    `bun run lint --fix ${filenames.join(' ')}`,
    `bunx prettier --write ${filenames.join(' ')}`,
  ],

  '**/*.css': (filenames) => [
    `bun run lint:styles --fix ${filenames.join(' ')}`,
    `bunx prettier --write  ${filenames.join(' ')}`,
  ],

  '**/*.(md|json)': (filenames) =>
    `bunx prettier --write ${filenames.join(' ')}`,
};

module.exports = config;
