import React, {Fragment} from 'react';
import Home from "./components/Home";
import Leaderboard from "./components/Leaderboard";
import Header from "./components/Header";
import './App.css';
import {Route} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Header />
      <Route exact path="/" component={Home} />
      <Route exact path="/leaderboard" component={Leaderboard} />
    </div>
  );
}

export default App;
