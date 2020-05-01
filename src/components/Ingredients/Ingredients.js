import React, { useState } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  const removeIngredientHandler = (id) => {
    setUserIngredients((previousUserIngredients) =>
      previousUserIngredients.filter((ingredient) => ingredient.id !== id)
    );
  };

  const addIngredientHandler = (ingredient) => {
    console.log("Saving ingredient: ", ingredient);

    fetch(`${process.env.REACT_APP_FB_URL}/ingredients.json`, {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((body) => {
        console.log("Saved ingredient name: ", body);

        setUserIngredients((previousUserIngredients) => [
          ...previousUserIngredients,
          {
            id: body.name,
            ...ingredient,
          },
        ]);
      });
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
