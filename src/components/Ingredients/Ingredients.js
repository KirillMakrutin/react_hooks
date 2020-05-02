import React, { useState, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // do load in Search component
  // useEffect(
  //   () => {
  //     fetch(`${process.env.REACT_APP_FB_URL}/ingredients.json`)
  //       .then((resp) => resp.json())
  //       .then((respData) => {
  //         const loadedIngredients = [];

  //         for (let key in respData) {
  //           loadedIngredients.push({
  //             id: key,
  //             ...respData[key],
  //           });
  //         }

  //         setUserIngredients(loadedIngredients);
  //       });
  //   },
  //   // adding a second argument make hook acts as componentDidMount (without - like componentDidUpdate for each render cycle)
  //   []
  // );

  const filteredIngredientsHandler = useCallback(
    (filteredIngredients) => setUserIngredients(filteredIngredients),
    []
  );

  const removeIngredientHandler = (id) => {
    setIsLoading(true);

    fetch(`${process.env.REACT_APP_FB_URL}/ingredients/${id}.json`, {
      method: "DELETE",
    })
      .then((resp) => {
        setUserIngredients((previousUserIngredients) =>
          previousUserIngredients.filter((ingredient) => ingredient.id !== id)
        );
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const addIngredientHandler = (ingredient) => {
    setIsLoading(true);

    console.log("Saving ingredient: ", ingredient);

    fetch(`${process.env.REACT_APP_FB_URL}/ingredients.json`, {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        setIsLoading(false);
        return resp.json();
      })
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

  const clearErrorHandler = () => setError();

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearErrorHandler}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
