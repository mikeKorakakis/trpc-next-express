touch package.json
yarn add -W -D concurrently wsrun

{
  "name": "trpc-node-react",
  "private": "true",
  "scripts": {
    "start": "concurrently \"wsrun --parallel start\""
  },
  "workspaces": [
    "packages/*"
  ],
  "devDependencies": {
    "concurrently": "^7.2.2",
    "wsrun": "^5.2.4"
  }
}


cd packages/server
yarn init -y && yarn add -D typescript && npx tsc --init 

{
  "compilerOptions": {
    "target": "es2018",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "strictPropertyInitialization": false,
    "skipLibCheck": true
  }
}

yarn add @trpc/server@next cors dotenv express  && yarn add -D @types/express @types/node @types/cors morgan @types/morgan ts-node nodemon prisma tsconfig-paths

npx prisma init --datasource-provider sqlite

touch .env

NODE_ENV=development
ORIGIN=http://localhost:3000
