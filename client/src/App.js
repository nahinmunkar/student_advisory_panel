import React, { useEffect } from "react"; // Added useEffect import
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Auth from "./components/auth/Auth";
import Main from "./components/Main";
import MentorDashboard from "./components/dashboard/mentorDashboard/MentorDashboard";
import { SocketContext, socket } from "./socket/socket";

const App = () => {
  // Added reCAPTCHA script loader
  useEffect(() => {
    // Remove existing recaptcha scripts to prevent duplicates
    const existingScripts = document.querySelectorAll('script[src*="recaptcha/api.js"]');
    existingScripts.forEach(script => script.remove());

    // Create and inject new script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.REACT_APP_RECAPTCHA_KEY}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <React.StrictMode>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Main} />
          <Route path="/admin" exact component={Auth} />
          <Route path="/mentor" exact component={Auth} />
          <Route path="/mentee" exact component={Auth} />
          
          <SocketContext.Provider value={socket}>
            <Route path="/admin/dashboard" exact component={MentorDashboard} />
            <Route path="/mentor/dashboard" exact component={MentorDashboard} />
            <Route path="/mentee/dashboard" exact component={MentorDashboard} />
          </SocketContext.Provider>
        </Switch>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;