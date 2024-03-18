import { Static, Type } from '@sinclair/typebox'

// JSON Schema of the object to be used in the OpenAPI spec
export const ColorSchema = Type.Object({
  color: Type.String()
})

// Typescript type built from the above schema to be used in the code
export type Color = Static<typeof ColorSchema>
