const config = {
  '**/*.(ts|tsx)': () => 'npm run tsc --noEmit',

  '**/*.(ts|tsx|js|cjs|mjs|jsx|astro)': (filenames) => [
    `npm run lint --fix ${filenames.join(' ')}`,
    `npx prettier --write ${filenames.join(' ')}`,
  ],

  '**/*.css': (filenames) => [
    `npm run lint:styles --fix ${filenames.join(' ')}`,
    `npx prettier --write  ${filenames.join(' ')}`,
  ],

  '**/*.(md|json)': (filenames) =>
    `npx prettier --write ${filenames.join(' ')}`,
};

module.exports = config;
