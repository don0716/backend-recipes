const express = require("express");
const app = express();
app.use(express.json()); //Express Syntax

// running cors wil allow frontend or any external client to access My API
const cors = require("cors");
app.use(cors());

// Get database and model in this file.
const { initializeDatabase } = require("./db/db.connect");
const Recipe = require("./models/recipe.models");
initializeDatabase();

const createRecipe = async (newRecipe) => {
  try {
    const recipe = new Recipe(newRecipe);
    const savedRecipe = await recipe.save();
    return savedRecipe;
  } catch (error) {
    console.log("There was an error. ", error);
  }
};

app.post("/recipes", async (req, res) => {
  try {
    const savedRecipe = await createRecipe(req.body);
    res
      .status(201)
      .json({ message: "Recipe Added Successfully", recipe: savedRecipe });
  } catch (error) {
    res.status(500).json({ error: "Failed to add Recipe." });
  }
});

// 6. Create an API to get all the recipes in the database as a response. Make sure to handle errors properly.
const readAllRecipes = async () => {
  try {
    const recipes = await Recipe.find();
    return recipes;
  } catch (error) {
    console.log("Error occured. ", error);
  }
};
app.get("/recipes", async (req, res) => {
  try {
    const recipes = await readAllRecipes();
    if (recipes.length != 0) {
      res.json(recipes);
    } else {
      res.status(400).json({ error: "No Books Found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed fetch Recipe Data." });
  }
});

// 7. Create an API to get a recipe's details by its title. Make sure to handle errors properly.\
const readRecipeByTitle = async (recipeTitle) => {
  try {
    const recipes = await Recipe.find({ title: recipeTitle });
    return recipes;
  } catch (error) {
    console.log("There was an Error.");
  }
};

app.get("/recipes/title/:recipeTitle", async (req, res) => {
  try {
    const recipes = await readRecipeByTitle(req.params.recipeTitle);
    if (recipes != 0) {
      res
        .status(201)
        .json({ message: "Successfully Found Recipe", recipe: recipes });
    } else {
      res.status(400).json({ error: "No Recipe found with that Title" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Recipe Data." });
  }
});

// 8. Create an API to get details of all the recipes by an author. Make sure to handle errors properly.
const readRecipeByAuthor = async (authorName) => {
  try {
    const recipes = await Recipe.find({ author: authorName });
    return recipes;
  } catch (error) {
    console.log(error);
  }
};
app.get("/recipes/author/:authorName", async (req, res) => {
  try {
    const recipes = await readRecipeByAuthor(req.params.authorName);
    if (recipes.length != 0) {
      res.status(201).json({
        message: "Successfully Found Recipes By Author",
        recipe: recipes,
      });
    } else {
      res.status(401).json({ error: "Failed to find Data." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Fetch Recipe Data." });
  }
});

// 9. Create an API to get all the recipes that are of "Easy" difficulty level.
const readByDifficultyLevel = async (difficultyLevel) => {
  try {
    const recipes = await Recipe.find({
      difficulty: difficultyLevel,
    });
    return recipes;
  } catch (error) {
    console.log(error);
  }
};
app.get("/recipes/difficulty/:difficultyLevel", async (req, res) => {
  try {
    const recipes = await readByDifficultyLevel(req.params.difficultyLevel);
    if (recipes.length != 0) {
      res.json(recipes);
    } else {
      res.status(401).json({ error: "No Recipes found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Data." });
  }
});

// 10. Create an API to update a recipe's difficulty level with the help of its id. Update the difficulty of "Spaghetti Carbonara" from "Intermediate" to "Easy". Send an error message "Recipe not found" if the recipe is not found. Make sure to handle errors properly.

const findByIdAndUpdateDifficultyLevel = async (recipeId, difficultyLevel) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      difficultyLevel,
      { new: true, runValidators: true }
    );
    return updatedRecipe;
  } catch (error) {
    console.log("Error in Updating Recipe Difficulty Level", error);
  }
};
app.post("/recipes/difficulty/:recipeId", async (req, res) => {
  try {
    const updatedRecipe = await findByIdAndUpdateDifficultyLevel(
      req.params.recipeId,
      req.body
    );
    if (updatedRecipe) {
      res.status(200).json({
        message: "Recipe Updated Successfully.",
        recipeUdpate: updatedRecipe,
      });
    } else {
      res.status(401).json({ error: "Failed to Update" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Update Recipe." });
  }
});

// 11. Create an API to update a recipe's prep time and cook time with the help of its title. Update the details of the recipe "Chicken Tikka Masala". Send an error message "Recipe not found" if the recipe is not found. Make sure to handle errors properly.
const findByTitleAndUpdateData = async (recipeTitle, recipeBodyToUpdate) => {
  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { title: recipeTitle },
      recipeBodyToUpdate,
      { new: true }
    );
    return updatedRecipe;
  } catch (error) {
    console.log(error);
  }
};
app.post("/recipes/updatedata/:recipeTitle", async (req, res) => {
  try {
    const updatedRecipe = await findByTitleAndUpdateData(
      req.params.recipeTitle,
      req.body
    );
    if (updatedRecipe) {
      res.status(201).json({
        message: "Recipe updated Successfully.",
        recipeUpdate: updatedRecipe,
      });
    } else {
      res.status(400).json({ error: "Not Found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Update Data." });
  }
});

// Updated recipe data: { "prepTime": 40, "cookTime": 45 }

// 12. Create an API to delete a recipe with the help of a recipe id. Send an error message "Recipe not found" if the recipe does not exist. Make sure to handle errors properly.
const deleteRecipe = async (recipeId) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
    return deletedRecipe;
  } catch (error) {
    console.log(error);
  }
};
app.delete("/recipes/:recipeId", async (req, res) => {
  try {
    const deletedRecipe = await deleteRecipe(req.params.recipeId);
    if (deletedRecipe) {
      res.status(200).json({
        message: "Recipe Deleted Successfully.",
        recipe: deletedRecipe,
      });
    } else {
      res.status(404).json({ error: "Recipe Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Delete Recipe." });
  }
});

// Port 3000 using express to view on postman in Local.
const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server is running on, ", PORT);
});
