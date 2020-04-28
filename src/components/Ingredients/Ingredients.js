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
    setUserIngredients((previousUserIngredients) => [
      ...previousUserIngredients,
      {
        id: Math.random().toString(),
        ...ingredient,
      },
    ]);
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
