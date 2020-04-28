import React, { useState } from "react";

import Card from "../UI/Card";
import "./IngredientForm.css";

const IngredientForm = React.memo((props) => {
  // const [ingredientState, setIngredientState] = useState({
  //   title: "",
  //   amount: "",
  // });

  const [titleState, setTitleState] = useState("");
  const [amountState, setAmountState] = useState("");

  const submitHandler = (event) => {
    event.preventDefault();
    // ...
  };

  const handleTitleChange = (event) => {
    // const newTitle = event.target.value;

    // setIngredientState((oldIngredientState) => ({
    //   ...oldIngredientState,
    //   title: newTitle,
    // }));

    setTitleState(event.target.value);
  };

  const handleAmountChange = (event) => {
    // const newAmount = event.target.value;

    // setIngredientState((oldIngredientState) => ({
    //   ...oldIngredientState,
    //   amount: newAmount,
    // }));

    setAmountState(event.target.value);
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              // value={ingredientState.title}
              value={titleState}
              onChange={handleTitleChange}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              // value={ingredientState.amount}
              value={amountState}
              onChange={handleAmountChange}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
