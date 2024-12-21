import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAPI_API_KEY,
    dangerouslyAllowBrowser: true
  });
  


  export { openai };