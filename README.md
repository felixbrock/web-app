# web-app

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

<!-- npm i -D eslint-config-airbnb

INSTALL ALL: npm info "eslint-config-airbnb@latest" peerDependencies

CHECK FOR RIGHT VERSIONS AT: https://www.npmjs.com/package/eslint-config-airbnb-typescript
npm i -D eslint-config-airbnb-typescript
npm i -D @typescript-eslint/eslint-plugin@^???
npm i -D @typescript-eslint/parser@^??? -->

(https://prettier.io/docs/en/install.html)
prettier: npm install --save-dev --save-exact prettier

(https://github.com/prettier/eslint-config-prettier#installation)
prettier: npm install --save-dev eslint-config-prettier

(https://thesoreon.com/blog/how-to-set-up-eslint-with-typescript-in-vs-code)
vs-code (Preferences: Open Settings (JSON)): "eslint.validate": ["typescript", "typescriptreact"]

------------------------------

Docker deployment

aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 085009017826.dkr.ecr.eu-central-1.amazonaws.com

$newVersion = 8; $previousVersion = $newVersion - 1; $name = '085009017826.dkr.ecr.eu-central-1.amazonaws.com/web-app'; docker build -t "${name}:v1.0.${newVersion}" .; docker push "${name}:v1.0.${newVersion}"; docker rmi "${name}:v1.0.${previousVersion}" aws ecr batch-delete-image --repository-name web-app --image-ids "imageTag=v1.0.${previousVersion}"

<!-- docker run -dp 3006:80 085009017826.dkr.ecr.eu-central-1.amazonaws.com/web-app:v1.0.0 -->

aws ecs update-service --cluster hivedive --service web-app --force-new-deployment

------------------------------