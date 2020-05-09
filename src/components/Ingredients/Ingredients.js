import React, { useCallback, useReducer, useMemo } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

// regular funtion is defined outside to not recreate during re-redner (it can also be located inside if we depends on props)
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

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...currentHttpState, loading: false };
    case "ERROR":
      return { loading: false, error: action.error };
    case "CLEAR":
      return {
        ...currentHttpState,
        error: null,
      };
    default:
      throw new Error("Illegal Action!");
  }
};

const Ingredients = () => {
  // 2nd arg is an initial state
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });

  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

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

  const removeIngredientHandler = useCallback((id) => {
    dispatchHttp({ type: "SEND" });

    fetch(`${process.env.REACT_APP_FB_URL}/ingredients/${id}.json`, {
      method: "DELETE",
    })
      .then((resp) => {
        dispatchHttp({ type: "RESPONSE" });
        dispatch({
          type: "DELETE",
          id: id,
        });
        // setUserIngredients((previousUserIngredients) =>
        //   previousUserIngredients.filter((ingredient) => ingredient.id !== id)
        // );
      })
      .catch((error) => {
        dispatchHttp({ type: "ERROR", error: error.message });
      });
  }, []);

  const addIngredientHandler = useCallback((ingredient) => {
    dispatchHttp({ type: "SEND" });

    console.log("Saving ingredient: ", ingredient);

    fetch(`${process.env.REACT_APP_FB_URL}/ingredients.json`, {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        dispatchHttp({ type: "RESPONSE" });
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
  }, []);

  const clearErrorHandler = useCallback(
    () => dispatchHttp({ type: "CLEAR" }),
    []
  );

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearErrorHandler}>{httpState.error}</ErrorModal>
      )}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
