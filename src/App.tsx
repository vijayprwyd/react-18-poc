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
   * In React 17, if our callback ( increment ) has an async action , then the component is re-rendered twice in this case.
   * If the callback doesn't have an async action then the multiple state updates are batched to a single update and the 
   * component is re-rendered only once.
   * 
   * 
   * In React 18, automatic batching of state updates happens always . So regardless of our function has async actions or not
   * the component is re-rendered only once.
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
