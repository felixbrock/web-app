# demo-frontend

Setup
npx create-react-app my-app --template typescript

(https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md)
(https://eslint.org/blog/2019/01/future-typescript-eslint)
eslint: npm i --save-dev eslint typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin

(https://github.com/iamturns/eslint-config-airbnb-typescript)
eslint: npm install eslint-config-airbnb-typescript --save-dev

(Check which versions are required. See output of previous command. Maybe installing without versions?)
eslint: npm install eslint-plugin-import --save-dev
eslint: npm install eslint-plugin-jsx-a11y --save-dev
eslint: npm install eslint-plugin-react --save-dev
eslint: npm install eslint-plugin-react-hooks --save-dev

(https://prettier.io/docs/en/install.html)
prettier: npm install --save-dev --save-exact prettier

(https://github.com/prettier/eslint-config-prettier#installation)
prettier: npm install --save-dev eslint-config-prettier

(https://thesoreon.com/blog/how-to-set-up-eslint-with-typescript-in-vs-code)
vs-code (Preferences: Open Settings (JSON)): "eslint.validate": ["typescript", "typescriptreact"]