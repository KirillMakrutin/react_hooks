import React, { useState, useCallback, useReducer } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

// regular funtion is defined outside to not recreate during re-redner
const ingredientReducer = (currentIngredients, action) => {
  console.log("Currnet ingredients and action:", currentIngredients, action);

  switch (action.type) {
    case "SET":
      // returns new state;
      return action.ingredients;
    case "DELETE":
      return currentIngredients.filter(
        (ingredient) => ingredient.id !== action.id
      );
    case "ADD":
      return [...currentIngredients, action.ingredient];
    default:
      throw new Error("Illegal Action!");
  }
};

const Ingredients = () => {
  // 2nd arg is an initial state
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);

  // const [userIngredients, setUserIngredients] = useState([]);
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

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    // setUserIngredients(filteredIngredients);
    dispatch({
      type: "SET",
      ingredients: filteredIngredients,
    });
  }, []);

  const removeIngredientHandler = (id) => {
    setIsLoading(true);

    fetch(`${process.env.REACT_APP_FB_URL}/ingredients/${id}.json`, {
      method: "DELETE",
    })
      .then((resp) => {
        dispatch({
          type: "DELETE",
          id: id,
        });
        // setUserIngredients((previousUserIngredients) =>
        //   previousUserIngredients.filter((ingredient) => ingredient.id !== id)
        // );
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

        dispatch({
          type: "ADD",
          ingredient: {
            id: body.name,
            ...ingredient,
          },
        });

        // setUserIngredients((previousUserIngredients) => [
        //   ...previousUserIngredients,
        //   {
        //     id: body.name,
        //     ...ingredient,
        //   },
        // ]);
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
