import { FastifyInstance, FastifyReply } from "fastify";
// import { registerUserSchema } from "./user.schema";
// import { Type } from "@sinclair/typebox";
import { CreateUserInput, registerUserSchema } from "./user.schema";
import { Type } from "@sinclair/typebox";
import { createUserHandler } from "./user.controller";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

// import { createUserHandler } from "./user.controller";
// import { User } from "@prisma/client";
// import {
//     loginHandler,
//     registerUserHandler,
//     getUsersHandler,
// } from "./user.controller";
// import { Type } from '@sinclair/typebox';
// import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
const userRoute: FastifyPluginAsyncTypebox = async function(server: FastifyInstance) {
    server.post<{ Body: CreateUserInput, Reply: FastifyReply }>(
        "/register",
        {
            schema: {
                body: registerUserSchema,
                response: {
                    200: Type.Object({ok: Type.String()})
                }
            }
        },
        createUserHandler
    )
}
export default userRoute;