import { Static, Type } from '@sinclair/typebox'

// JSON Schema of the object to be used in the OpenAPI spec
export const FooBarSchema = Type.Object({
  bar: Type.String()
})

// Typescript type built from the above schema to be used in the code
export type FooBar = Static<typeof FooBarSchema>
