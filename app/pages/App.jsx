import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Uploader from "./Uploader";
import History from "./History";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />  
        <Route path="/uploader" element={<Uploader />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
};

export default App;