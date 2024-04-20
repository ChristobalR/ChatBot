require('dotenv').config();
const OpenAI = require('openai').OpenAI;
const openai = new OpenAI()
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main(){

  let input
  rl.question('Ingrese algo: ', (answer) => {
    console.log(`Ha ingresado: ${answer}`);
    input = answer
    rl.close();
  });
  
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages:[
      {
      role:'system',
      content: ` Eres un chatbot `
       },
    {
      role:'user',
      content:`${input}`
    },
  ],
  })
  const content = response.choices[0].message.content;
  console.log(content)
}

main()

rl.on('close', () => {
  console.log('¡Adiós!');
  process.exit(0);
});