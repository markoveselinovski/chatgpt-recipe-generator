const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); 

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// API route to get recipes based on ingredients
app.post('/api/generate-recipe', async (req, res) => {
    const ingredients = req.body.ingredients;
    const apiKey = process.env.CHATGPT_API_KEY;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful chef.',
                    },
                    {
                        role: 'user',
                        content: `Generate a recipe with the following ingredients: ${ingredients.join(', ')}`,
                    },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );
        res.json(response.data.choices[0].message.content);
    } catch (error) {
        console.error('Error calling OpenAI API', error);
        res.status(500).send('Error generating recipe');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
