import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo(({ onLoadIngredients }) => {
  const [enteredFilter, setEnteredFilter] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    // to make it works you should add FB rule:
    // "ingredients":{
    //   ".indexOn":["title"]
    // }
    const timer = setTimeout(() => {
      // do search if user stop typing 500 mls ago (entered value that was 500 mls ago)
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
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
      }
    }, 500);

    return () => {
      // this function is executed berfore the next useEffect runs (if [] as a dependecny - before unmount)
      clearTimeout(timer);
    };
  }, [enteredFilter, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
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
