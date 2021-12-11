# React 18 - Features and Migration Guide



## 1. `ReactDOM.render` is replaced with `ReactDOM.createRoot`

```jsx
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Two different parts of the page can be rendered with different root APIs. We can selectively migrate our applications to React 18.

```jsx
const rootElement1 = document.getElementById("root1");
if (!rootElement1) throw new Error("Failed to find the root element");

ReactDOM.createRoot(rootElement1).render(
  <React.StrictMode>
    <App root="18" />
  </React.StrictMode>
);

const rootElement2 = document.getElementById("root2");
if (!rootElement2) throw new Error("Failed to find the root element");

ReactDOM.render(
  // Behaves as if its running React 17
  <React.StrictMode>
    <App root="17" />
  </React.StrictMode>,
  rootElement2
);
```

We can migrate to React 18 through conditional rendering supported by feature flags / environmental variables

```jsx
const REACT_18 = false; // Pass it via a feature flag / env variable

if (REACT_18) {
  ReactDOM.createRoot(rootElement1).render(
    <React.StrictMode>
      <App root="18" />
    </React.StrictMode>
  );
} else {
  ReactDOM.render(
    // Behaves as if its running React 17
    <React.StrictMode>
      <App root="17" />
    </React.StrictMode>,
    rootElement2
  );
}
```

## 2. Automatic Batching of state updates regardless of where they are called

```jsx

import { useState } from "react";

function App() {

  const [count, setCount] = useState(0);
  const [isOdd, setIsOdd] = useState(true);

  const increment = () => {
    setTimeout(() => {
      console.log("Dummy async callback")
      setCount((count) => count + 1);
      setIsOdd((isOdd) =>  !isOdd);  
    }, 0);
  }

  /**
   * In React 17, if our callback ( increment ) has an async action , then the component is re-rendered twice in this case, unless wrapped with ReactDOM.unstable_batchedUpdates
   * If the callback doesn't have an async action then the multiple state updates are batched to a single update and the component is re-rendered only once.
   * In React 18, automatic batching of state updates happens always . So regardless of our function has async actions or not the component is re-rendered only once.
   */
  console.log("Re-rendered"); // 2 times in React 17 but only once in React 18

  return (
    <div className="App">
      <div> Count  = {count} </div>
      <div> Is Odd = {isOdd} </div>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

export default App;

```
Top opt out of this behavior we can simply use :

```jsx

  const increment = () => {
    setTimeout(() => {
      console.log("Dummy async callback")
      ReactDOM.flushSync(() => {
        setCount((count) => count + 1);
      });
      // setCount((count) => count + 1);
      setIsOdd((isOdd) =>  !isOdd);  // Re-rendered twice
    }, 0);
  }
```

