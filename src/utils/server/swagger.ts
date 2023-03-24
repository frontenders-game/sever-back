import Swagger from '@fastify/swagger';
import SwaggerUI from '@fastify/swagger-ui';
import  { FastifyInstance} from 'fastify'
import packageInfo from "../../../package.json"



export default function addSwagger(fastify: FastifyInstance) {
    fastify.register(Swagger, {
        swagger: {
            info: {
                title: packageInfo.description,
                version: packageInfo.version
            }
        }
    }).register(SwaggerUI, {
        routePrefix: "/docs"
    })

}