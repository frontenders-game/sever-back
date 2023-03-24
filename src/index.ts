import { buildServer } from './server';

async function main(): Promise<void> {
    const server = buildServer();
    server.listen(
        {
            port: parseInt(process.env.SERVER_PORT || "3000") ,
            host: String(process.env.SERVER_HOST || "0.0.0.0")
        },
        (err: Error | null, address: string): void => {
            if (err) {
                server.log.error(err)
                process.exit(1)
            }
        })
}

main();