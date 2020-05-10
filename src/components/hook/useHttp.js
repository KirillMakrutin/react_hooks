import { useCallback, useReducer } from "react";

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null, data: null };
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

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });

  const sendRequest = useCallback((url, { method, body }, callback) => {
    dispatchHttp({ type: "SEND" });

    fetch(url, {
      method,
      body,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        return resp.json();
      })
      .then((respData) => {
        console.log("Response data: ", respData);

        dispatchHttp({
          type: "RESPONSE",
        });

        callback(respData);
      })
      .catch((error) => {
        dispatchHttp({ type: "ERROR", error: error.message });
      });
  }, []);

  const clearError = useCallback(() => {
    dispatchHttp({ type: "CLEAR" });
  }, []);

  return {
    loading: httpState.loading,
    error: httpState.error,
    sendRequest: sendRequest,
    clearError: clearError,
  };
};

export default useHttp;
