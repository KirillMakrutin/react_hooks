import React, { useCallback, useReducer, useMemo } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

import useHttp from "../hook/useHttp";

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

const Ingredients = () => {
  // 2nd arg is an initial state
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);

  // custom hook
  const { loading, error, sendRequest, clearError } = useHttp();

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

  const removeIngredientHandler = useCallback(
    (id) => {
      sendRequest(
        `${process.env.REACT_APP_FB_URL}/ingredients/${id}.json`,
        { method: "DELETE" },
        () =>
          dispatch({
            type: "DELETE",
            id: id,
          })
      );
    },
    [sendRequest]
  );

  const addIngredientHandler = useCallback(
    (ingredient) => {
      sendRequest(
        `${process.env.REACT_APP_FB_URL}/ingredients.json`,
        { method: "POST", body: JSON.stringify(ingredient) },
        (body) => {
          console.log("Saved ingredient name: ", body);
          dispatch({
            type: "ADD",
            ingredient: {
              id: body.name,
              ...ingredient,
            },
          });
        }
      );
    },
    [sendRequest]
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
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={loading}
      />

      <section>
        <Search sendRequest={sendRequest} onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
