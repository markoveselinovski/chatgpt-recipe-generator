import React, { useState } from 'react';
import axios from 'axios';
import './App.css';  

function App() {
    const [ingredients, setIngredients] = useState('');
    const [recipeName, setRecipeName] = useState('');  
    const [recipe, setRecipe] = useState('');

    const handleGenerateRecipe = async () => {
        if (ingredients.trim()) {
            try {
                const response = await axios.post('http://localhost:5000/api/generate-recipe', {
                    ingredients: ingredients.split(',').map(ingredient => ingredient.trim()),
                });
                const recipeText = response.data;
                setRecipeName(getRecipeName(recipeText));  
                setRecipe(formatRecipe(recipeText));
            } catch (error) {
                console.error('Error generating recipe:', error);
            }
        }
    };

    const getRecipeName = (recipeText) => {
        const firstLine = recipeText.split('\n')[0];  
        return firstLine;
    };

    const formatRecipe = (recipeText) => {
        const ingredientsStart = recipeText.indexOf("Ingredients:");
        const instructionsStart = recipeText.indexOf("Instructions:");

        // Extract the relevant sections
        const ingredients = recipeText
            .slice(ingredientsStart + "Ingredients:".length, instructionsStart)
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('<br>');  

        const instructions = recipeText
            .slice(instructionsStart + "Instructions:".length)
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('<br>');  

        return `<h2>Ingredients:</h2><p>${ingredients}</p><h2>Instructions:</h2><p>${instructions}</p>`;
    };

    return (
        <div className="app-background">
            <div className="form-container">
                <h1>Recipe Generator</h1>
                <input
                    type="text"
                    placeholder="Enter ingredients separated by commas"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                />
                <button 
                    onClick={handleGenerateRecipe}
                    disabled={!ingredients.trim()}
                    style={{ 
                        backgroundColor: ingredients.trim() ? 'lightgreen' : '#d3d3d3', 
                        cursor: ingredients.trim() ? 'pointer' : 'not-allowed'
                    }}
                >
                    Generate Recipe
                </button>
                {recipe && (
                    <div className="recipe-container">
                        <h2>{recipeName}</h2>  {/* Display recipe name */}
                        <div className="recipe-content" dangerouslySetInnerHTML={{ __html: recipe }} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
