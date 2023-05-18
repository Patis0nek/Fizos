import './App.css';
import React, { useEffect, useState } from "react";
import RandomNumberGenerator from './random.js';




function App() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessSchoolGranted, setAccessSchoolGranted] = useState(false);
  const [password, setPassword] = useState("");
  const [klasa, setKlasa] = useState("");
  const [szkola, setSzkola] = useState("");

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleLoginChange(event) {
    setKlasa(event.target.value);
  }

  function handleSchoolChange(event) {
    setSzkola(event.target.value);
  }

  function handleSchoolSubmit(event) {
    event.preventDefault();
    if (szkola.length > 0) {
      setAccessSchoolGranted(true);
    }
  }


  function handleFormSubmit(event) {
    event.preventDefault();
    if (password === "password") {
      if (klasa.length > 0 && klasa.length < 4) {
        setAccessGranted(true);
      }
    }
  }

  return (
    <div className="App">
      {accessGranted ? (
        <RandomNumberGenerator klasa={klasa} />
      ) : (
        <div className="popup">
          <form className="formup">
            <i className="fa-solid fa-user"></i>
            <input
              type="text"
              placeholder="klasa"
              value={klasa}
              className="login"
              onChange={handleLoginChange}
            />
            <i className="fa-solid fa-lock"></i>
            <input
              type="password"
              placeholder="hasło"
              value={password}
              onChange={handlePasswordChange}
            />
            <button onClick={handleFormSubmit} className="przycisk" >Zaloguj</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
