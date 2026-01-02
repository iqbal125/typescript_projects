

export const corsSettings = {
    origin: '*',
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['*'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
}