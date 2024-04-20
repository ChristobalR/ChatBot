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


const flowIngreso = addKeyword(['']).addAction({ capture: true }, async (ctx, { flowDynamic, state, gotoFlow }) => {
  const parametro23 = 'Hola dame informacion de la empresa con pocas palabras'
  const parametro25 = 'En la siguiente respuesta, empieza con "Aqui tienes la lista de comandos", no incluyas nada mas, solo la lista, no necesito que me respondas a mi, es un mensaje automatico'
      const response = await openaiChat(parametro23)
      const response2 = await openaiChat(parametro25)
      await flowDynamic (`${response}`)
      await flowDynamic (`${response2}`)
      return gotoFlow(flowPrincipal)

        

    })

const flowPrincipal = addKeyword(EVENTS.ACTION).addAction({ capture: true }, async (ctx, { flowDynamic, state, gotoFlow }) => {
  const userParameter = ctx.body;
      if(userParameter == "miembros"){
        await gotoFlow(flowSecundario)
      }
      else{
        const response = await openaiChat(userParameter);
        await flowDynamic(` ${response}`);
        return gotoFlow(flowPrincipal)
      }
        
        

    })

const flowSecundario = addKeyword(EVENTS.ACTION)
.addAction(async (_, { flowDynamic }) => {
    const parametro232 = 'Dame una introduccion a que informacion va venir en la lista de miembros resumida y en pocas palabras, sin mostrar toda la lista de miembros'
    const response23 = await openaiChat2(parametro232)
    await flowDynamic(` ${response23}`);
})
  .addAction({ capture: true }, async (ctx, { flowDynamic, state, gotoFlow}) => {
    await state.update({ name: ctx.body })
    const userParameter = ctx.body;
    const response = await openaiChat2(userParameter);
    await flowDynamic(` ${response}`);
    return gotoFlow(flowSecundario2)
    
  });

  const flowSecundario2 = addKeyword(EVENTS.ACTION)
.addAction(async (_, { flowDynamic }) => {
    
})
  .addAction({ capture: true }, async (ctx, { flowDynamic, state, gotoFlow}) => {
    await state.update({ name: ctx.body })
    const userParameter = ctx.body;
    const response = await openaiChat2(userParameter);
    await flowDynamic(` ${response}`);
    return gotoFlow(flowSecundario2)
    
  });

const main = async () => {
    const adapterDB = new MockAdapter();
    adapterDB.flows = [flowPrincipal, flowSecundario, flowSecundario2,flowIngreso];

    const adapterFlow = createFlow(adapterDB.flows);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB, });

    QRPortalWeb();
};


const openaiChat = async (userParameter) => {
    
  
  
    const systemMessage = `Eres un chatbot de asistencia
 saluda al cliente de forma amistosa, no incluyas informacion de las palabras claves en el saludo o la informacion
 recuerda que somos una empresa de seguridad, y que nos dedicamos a la ciberseguridad, con sede en viña del mar, chile, por si te preguntan quienes somos.
---------------------------------------------------------------------------------------------
 A continuacion te dare la lista con las palabras claves que el usuario tendra que ingresar si es que lo necesita:
    - miembros - escribe: miembros
    - registro - escribe: registro
    - reclamos - escribe: reclamos
    - portal web - escribe: pweb
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

        * IMPORTANTE EL FORMATO DE LA TABLA ES PARA QUE TE HAGAS UNA REFERENCIA, NO MANDES AL CLIENTE CON ESE FORMATO DE GUIONES Y | , que le rompes la pantalla de whatsapp 
        | ID | Nombre     | Edad | Género | País      | Correo electrónico        | Nivel de membresía | Última compra  | Suscripción activa | Puntos de fidelidad |
        |----|------------|------|--------|-----------|---------------------------|---------------------|-----------------|---------------------|----------------------|
        | 1  | Juan Pérez | 28   | Hombre | Argentina | juan@example.com          | Oro                 | 2023-03-15      | Sí                | 300                |
        | 2  | Ana Gómez   | 35   | Mujer  | España    | ana@example.com           | Plata               | 2023-03-10      | Sí                | 200                |
        | 3  | Mark Smith  | 42   | Hombre | EE. UU.   | mark@example.com          | Bronce              | 2023-03-05      | No                | 100                |
        | 4  | Maria Liu   | 30   | Mujer  | China     | maria@example.com         | Oro                 | 2023-03-18      | Sí                | 350                |
        | 5  | Ahmed Khan  | 25   | Hombre | India     | ahmed@example.com         | Plata               | 2023-03-12      | Sí                | 180                |
        | 6  | Sophie Martin| 38  | Mujer  | Francia   | sophie@example.com        | Bronce              | 2023-03-08      | No                | 90                 |
        | 7  | Carlos Silva| 32   | Hombre | Brasil    | carlos@example.com        | Oro                 | 2023-03-20      | Sí                | 400                |
        | 8  | Elena Petrova| 29  | Mujer  | Rusia     | elena@example.com         | Plata               | 2023-03-14      | No                | 160                |
        | 9  | Amir Hassan | 27   | Hombre | Egipto    | amir@example.com          | Bronce              | 2023-03-07      | Sí                | 120                |
        | 10 | Mia Johnson | 31   | Mujer  | Canadá    | mia@example.com     
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