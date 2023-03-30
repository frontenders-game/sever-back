import Fastify, { FastifyInstance, FastifyReply, FastifyRequest  } from 'fastify'
import fastifyStatic from '@fastify/static'
import path from 'path'
import multipart from "@fastify/multipart"
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import AutoLoad from '@fastify/autoload';
import addSwagger from "./utils/server/swagger";
import { JWT } from '@fastify/jwt'; // fastifyJWT,

import ajvKeywords from "ajv-keywords";
import addSchemas from "./utils/server/add-schemas";
import { normalizeAjvErrors } from "./utils/server/ajv";
import addCors from "./utils/server/cors";


declare module "fastify" {
    interface FastifyRequest {
        jwt: JWT;
    }

    export interface FastifyInstance {
        authenticate: any;
    }
}

declare module "@fastify/jwt" {
    interface FastifyJWT {
        user: {
            id: number;
            email: string;
            name: string;
        };
    }
}

export function buildServer() {
    const server: FastifyInstance = Fastify({
        ajv: {
            customOptions: {
                removeAdditional: true, // Refer to [ajv options](https://ajv.js.org/options.html#removeadditional)
                useDefaults: true,
                coerceTypes: true,
                allErrors: true,
                verbose: true
            },
            plugins: [
                [ajvKeywords, ['transform' ]]
                // Usage: [plugin, pluginOptions] - Plugin with options
                // Usage: plugin - Plugin without options
            ]
        },
        logger: {
            transport: {
                target: "pino-pretty",
                options: {
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname',
                }
            }
        },
    }).withTypeProvider<TypeBoxTypeProvider>()

    server.setSchemaErrorFormatter((errors, scope) => normalizeAjvErrors(errors, scope))
    // console.log(path.join(__dirname, '../../public/'))
    // server.register(fastifyJWT, {secret: env.JWT_SECRET})
    server.register(multipart, {attachFieldsToBody: true})
        .register(fastifyStatic, {root: path.join(__dirname, '../../public/'), prefix: "/public/"})

    //Cors
    addCors(server)

    //Type.Ref schemas
    addSchemas(server)

    //swagger
    if (String(process.env.ENABLE_DOCS)) addSwagger(server)

    server.decorate(
        'authenticate',
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                await request.jwtVerify();
                server.log.info('authenticated');
            } catch (e) {
                server.log.info('auth error', e);
                return reply.send(`error in auth ${e}`);
            }
        }
    );

    server.addHook("preHandler", (req, reply, next) => {
        req.jwt = server.jwt;
        return next();
    });


    server.register(AutoLoad, {
        dir: `${__dirname}/modules`,
        options: {prefix: '/api'},
        maxDepth: 2,
        indexPattern: /[a-z]+.route.js$/
    });

    return server
}



