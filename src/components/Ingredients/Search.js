import React, { useState, useEffect } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo(({ onLoadIngredients }) => {
  const [enteredFilter, setEnteredFilter] = useState("");

  useEffect(() => {
    // to make it works you should add FB rule:
    // "ingredients":{
    //   ".indexOn":["title"]
    // }
    const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
    fetch(`${process.env.REACT_APP_FB_URL}/ingredients.json${query}`)
      .then((resp) => resp.json())
      .then((respData) => {
        const loadedIngredients = [];

        for (let key in respData) {
          loadedIngredients.push({
            id: key,
            ...respData[key],
          });
        }

        onLoadIngredients(loadedIngredients);
      });
  }, [enteredFilter, onLoadIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
