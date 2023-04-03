import { Static, Type } from "@sinclair/typebox";
import { routeSchema } from "../../types";
import { responseMessage } from "../shared/schemas";

export const federalSubjectSchema = Type.Object({
    name: Type.String(),
    code: Type.String({minLength: 2, maxLength: 2}),
    timezone: Type.String()
})

export type FederalSubject = Static<typeof federalSubjectSchema>
export const federalSubjectsSchema = Type.Array(federalSubjectSchema)

export type FederalSubjects = Static<typeof federalSubjectsSchema>

export const routeGetFederalSubjectsSchema = routeSchema({
    tags: ['federal-subjects'],
    response: {
        200: {
            message: responseMessage,
            data: federalSubjectsSchema
        }
    },
})
