import './App.css';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from './compenents/Navbar';
import Home from './compenents/Home';
import About from './compenents/About';
import Login from "./compenents/Login";
import Signup from "./compenents/Signup";
import NoteState from './context/notes/NoteState';
import Alert from './compenents/Alert';

import { useState } from "react";

function App() {

  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }
  return (
    <>
      <NoteState>
        <Router>
          <Navbar />
          <Alert alert={alert}/>
          <div className="container">
            <Routes>
              <Route path="/" element={<Home showAlert={showAlert} />} />
              <Route path="/about"  element={<About />} />
              <Route path="/login" element={<Login showAlert={showAlert}/>} />
              <Route path="/signup" element={<Signup showAlert={showAlert}/>} />
            </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
