<p align="center">
    <img width="300" src="./img/surreal-zod.svg" />
</p>

<h1 align="center">surrealdb-zod</h1>
<p align="center">
<a href="https://opensource.org/licenses/MIT" rel="nofollow"><img src="https://img.shields.io/github/license/ShadowWolf308/surrealdb-zod" alt="License"></a>
<a href="https://github.com/ShadowWolf308"><img src="https://img.shields.io/badge/created%20by-@ShadowWolf308 -45c724.svg" alt="Created by Levy van der Valk"></a>
<a href="https://www.npmjs.com/package/surrealdb-zod" rel="nofollow"><img src="https://img.shields.io/npm/dw/surrealdb-zod" alt="npm"></a>
<a href="https://github.com/ShadowWolf308/surrealdb-zod" rel="nofollow"><img src="https://img.shields.io/github/stars/ShadowWolf308/surrealdb-zod" alt="stars"></a>
</p>
<p align="center">Re-useable <a href="https://www.npmjs.com/package/zod">zod</a> schema's for use with <a href="https://www.npmjs.com/package/surrealdb">SurrealDB sdk</a>.</p>

## How to use
Install it with:

```sh
# using npm
npm i surrealdb-zod
# or using pnpm
pnpm i surrealdb-zod
# or using yarn
yarn add surrealdb-zod
```

Next, import the schema's, e.g.:

```ts
import { RecordIdSchema } from "surreal-zod";
```

Use it as you would a normal zod schema

e.g.:

```ts
import { RecordIdSchema, RecordIdSchemaOf } from "surreal-zod";
import { z } from "zod";

// `id` must be an instance of class `RecordId`
const PersonSchema = z.object({
	id: RecordIdSchema,
});
// or
// `id` must be an instance of class `RecordId` and table must be "person"
const PersonSchema = z.object({
	id: RecordIdSchemaOf("person"),
});
```

## Important notes
* All schema names consist of `{ClassName}Schema`, e.g. for `RecordId` it is `RecordIdSchema`
* If the class has optional generic types e.g. `RecordId` can be `RecordId<"person">` naming will be `{ClassName}SchemaOf` and will be a function  
e.g. usage: `const schema = RecordIdSchemaOf("person")`
* Some types like `Range` have required generic types, these schema's are function and follow the following naming scheme: `{ClassName}Schema`  
e.g.: `RangeSchema(z.string(), z.string())`
* Some schema function have props that are a `string` (e.g. `RecordIdSchemaOf`) and some are any zod schema (e.g. `RangeSchema`)

## References
* [zod docs](https://zod.dev/)
* [zod npm package ](https://www.npmjs.com/package/zod)
* [SurrealDB docs](https://surrealdb.com/)
* [SurrealDB npm package](https://www.npmjs.com/package/surrealdb)