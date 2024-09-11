import OpenAI from "openai";
const openai = new OpenAI();
let topic = "Marvel is better than DC";
let userMessage = "Marvel has better movies and that is seen with their box office numbers"
const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "system", content: "You are debating against a user" },
        {
            role: "user",
                content: 'The user\'s opinion is ${topic}. They state ${userMessage}. Rebutal this.',
        },
    ],
});

console.log(completion.choices[0].message);