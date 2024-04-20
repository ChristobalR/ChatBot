const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const fs = require('fs');


// Flujo principal

    const flowPrincipal = addKeyword([''])
        .addAction(async (_, { flowDynamic }) => {
            return flowDynamic('Buenas! ¿Cual es tu nombre?')
        })
        .addAction({ capture: true }, async (ctx, { flowDynamic, state }) => {
            await state.update({ name: ctx.body })
            return flowDynamic(`Gracias por tu nombre!: ${ctx.body}`)
        })
        .addAnswer('Chao!')

const main = async () => {
    const adapterDB = new MockAdapter();
    adapterDB.flows = [flowPrincipal];

    const adapterFlow = createFlow(adapterDB.flows);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
        onMessage: async (message, bot) => {
            // Responder siempre con el flujo principal
            await bot.reply(flowPrincipal, message);
            
            // Guardar la entrada en un archivo (por ejemplo, entrada.txt)
            fs.appendFile('entrada.txt', `${new Date().toISOString()} - ${message}\n`, (err) => {
                if (err) throw err;
                console.log('Entrada guardada en entrada.txt');
            });
        },
    });

    QRPortalWeb();
}

main();