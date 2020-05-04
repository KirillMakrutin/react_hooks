import React, { useContext } from "react";

import Ingredients from "./components/Ingredients/Ingredients";
import { AuthContext } from "./components/context/auth-context";
import Auth from "./components/Auth";

const App = (props) => {
  const authContext = useContext(AuthContext);

  if (authContext.isAuth) {
    return <Ingredients />;
  } else {
    return <Auth />;
  }
};

export default App;
