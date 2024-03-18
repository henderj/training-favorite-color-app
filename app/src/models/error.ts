import { Static, Type } from '@sinclair/typebox'

// These are basic errors that will resolve to a standard error response
export const ErrorResponseSchema = Type.Object({
  code: Type.Number(),
  message: Type.String()
})

export type ErrorResponseType = Static<typeof ErrorResponseSchema>

export function ErrorNotFound (message: string = 'Not Found'): ErrorResponseType {
  return {
    code: 404,
    message
  }
}

export function ErrorInvalidRequest (message: string = 'Bad Request'): ErrorResponseType {
  return {
    code: 400,
    message
  }
}

export function ErrorInternalServerError (code: number = 500, message: string = 'Internal Server Error'): ErrorResponseType {
  return {
    code,
    message
  }
}
