# surrealdb-zod
Re-useable [zod](https://www.npmjs.com/package/zod) schema's for use with [SurrealDB sdk](https://www.npmjs.com/package/surrealdb).

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