require('dotenv').config();
const OpenAI = require('openai').OpenAI;
const openai = new OpenAI()
const { EVENTS } = require('@bot-whatsapp/bot')
const { createBot, createProvider, createFlow, addKeyword} = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const fs = require('fs');
const clave1 = "1234"
// Flujo principal
let conversation = []; 
let conversation2 = [];
const flowPrincipal = addKeyword([('')]).addAction({ capture: true }, async (ctx, { flowDynamic, state }) => {
      
        const userParameter = ctx.body;
        const response = await openaiChat(userParameter);
        return flowDynamic(` ${response}`);
    })

const flowSecundario = addKeyword("miembros")
.addAction(async (_, { flowDynamic }) => {
    return flowDynamic('ACCESO CONCEDIDO')
})
  .addAction({ capture: true }, async (ctx, { flowDynamic, state, gotoFlow}) => {
    await state.update({ name: ctx.body })
    const userParameter = ctx.body;
    const response = await openaiChat2(userParameter);
    await flowDynamic(` ${response}`);
    return gotoFlow(flowSecundario2)
    
  });

  const flowSecundario2 = addKeyword("miembrosasd2dasdas")
.addAction(async (_, { flowDynamic }) => {
    
})
  .addAction({ capture: true }, async (ctx, { flowDynamic, state, gotoFlow}) => {
    await state.update({ name: ctx.body })
    const userParameter = ctx.body;
    const response = await openaiChat2(userParameter);
    await flowDynamic(` ${response}`);
    return gotoFlow(flowSecundario2)
    
  });
const confidencial2 = "Informacion confidencial"


const main = async () => {
    const adapterDB = new MockAdapter();
    adapterDB.flows = [flowPrincipal, flowSecundario, flowSecundario2];

    const adapterFlow = createFlow(adapterDB.flows);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB, });

    QRPortalWeb();
};


const openaiChat = async (userParameter) => {
    
  
  
    const systemMessage = `Eres un chatbot de asistencia, por lo que recibiras solicitudes de clientes y otorgaras las palabras claves
    para que el usuario pueda acceder a otras funciones
    - Si el usuario quiere acceder a miembros, dile que escriba "miembros" en el chat de whatsapp para derivarlo
`;
    conversation.push({ role: 'system', content: systemMessage });
      
      conversation.push({ role: 'user', content: userParameter });
  
     
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: conversation, 
      });
  
      
      const content = response.choices[0].message.content;
      
  
      
      conversation.push({ role: 'assistant', content });
      return response.choices[0].message.content;
     
     }
     const openaiChat2 = async (userParameter) => {
    
  
  
        const systemMessage = `Eres un chatbot que tiene acceso a la informacion de los miembros
        - Cristobal (programador)
        
    `;
        conversation2.push({ role: 'system', content: systemMessage });
          
          conversation2.push({ role: 'user', content: userParameter });
      
         
          const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: conversation2, 
          });
      
          
          const content = response.choices[0].message.content;
          
      
          
          conversation2.push({ role: 'assistant', content });
          return response.choices[0].message.content;
         
         }
    

     
main();