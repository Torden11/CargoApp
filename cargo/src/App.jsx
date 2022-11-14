import "./App.scss";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  } from "react-router-dom";
import Nav from "./Components/Nav";
import Home from "./Components/home/Main";
import MainCat from "./Components/containers/Main";
import MainMovie from "./Components/boxes/Main";
import LoginPage from "./Components/login/LoginPage";
import LogoutPage from "./Components/login/LogoutPage";
import { useState, useEffect, useCallback } from "react";
import { authConfig } from "./Functions/auth";
import React from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import DataContext from './Contexts/DataContext';
import Messages from './Components/Messages';
import RegisterPage from './Components/register/Main';

function App() {

  const [roleChange, setRoleChange] = useState(Date.now());
  const [msgs, setMsgs] = useState([]);
  const [showLinks, setShowLinks] = useState(false);

  const makeMsg = useCallback((text, type = '') => {
    let msgTypeClass;
    switch (type) {
      case 'success': msgTypeClass = 'ok';
        break;
      case 'error': msgTypeClass = 'error';
        break;
      case 'info': msgTypeClass = 'info';
        break;
      default: msgTypeClass = 'default';
    }
    const msg = {
      id: uuidv4(),
      text,
      class: msgTypeClass
    }
    setMsgs(m => [...m, msg]);
    setTimeout(() => {
      setMsgs(m => m.filter(mes => mes.id !== msg.id));
    }, 6000);
  }, []);

  return (
    <DataContext.Provider value={{
      msgs,
      setMsgs,
      makeMsg,
      showLinks,
      setShowLinks
    }}>
    <BrowserRouter>
      <ShowNav roleChange={roleChange} />
      <Messages/>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth role="user">
              <Home />
            </RequireAuth>
          }
        ></Route>
        <Route path="/login" element={<LoginPage setRoleChange={setRoleChange}/>} />
        <Route path="/logout" element={<LogoutPage setRoleChange={setRoleChange} />} />
        <Route
          path="containers"
          element={
            <RequireAuth role="admin">
              <MainCat />
            </RequireAuth>
          }
        ></Route>
        <Route
          path="boxes"
          element={
            <RequireAuth role="admin">
              <MainMovie />
            </RequireAuth>
          }
        ></Route>
        <Route path="/register" element={<RegisterPage setRoleChange={setRoleChange} />} />
      </Routes>
    </BrowserRouter>
    </DataContext.Provider>
  );
}

function ShowNav({roleChange}) {
  const [status, setStatus] = useState(1);
  useEffect(() => {
    axios
      .get("http://localhost:3003/login-check?role=admin", authConfig())
      .then((res) => {
        setStatus(res.data.status);
      });
  }, [roleChange]);
  return <Nav status={status} />;
}

function RequireAuth({ children, role }) {
  const [view, setView] = useState(<h2>Please wait...</h2>);
  useEffect(() => {
    axios
      .get("http://localhost:3003/login-check?role=" + role, authConfig())
      .then((res) => {
        if ("ok" === res.data.msg) {
          setView(children);
        } else if (res.data.status === 2) {
          setView(<h2>Unauthorize...</h2>);
        } else {
          setView(<Navigate to="/login" replace />);
        }
      })
  }, [children, role]);

  return view;
}

// function LoginPage({setRoleChange}) {
//   const navigate = useNavigate();

//   const [user, setUser] = useState("");
//   const [pass, setPass] = useState("");
//   const { makeMsg } = useContext(DataContext);

//   const doLogin = () => {
//     axios.post("http://localhost:3003/login", { user, pass }).then((res) => {
//       setRoleChange(Date.now());
//       if ("ok" === res.data.msg) {
//         login(res.data.key);
//         navigate("/", { replace: true });
//         makeMsg(res.data.text, res.data.type);
//       }
//     })
//     .catch(() => {
//       makeMsg('You are not logged in.', 'error');
//     })
//   };
//   return (
//     <div className="container-login">
//       <div className="login-content">
//         Name:{" "}
//         <input
//           type="text"
//           value={user}
//           onChange={(e) => setUser(e.target.value)}
//         ></input>
//       </div>
//       <div className="login-content">
//         Password:{" "}
//         <input
//           type="password"
//           value={pass}
//           onChange={(e) => setPass(e.target.value)}
//         ></input>
//       </div>
//       <button onClick={doLogin}>Login</button>
//     </div>
//   );
// }

// function LogoutPage({setRoleChange}) {
//   const { makeMsg } = useContext(DataContext);
//   useEffect(() => {
//     logout();
//     setRoleChange(Date.now());
//   makeMsg('See you soon!', 'info');
//   }, [setRoleChange, makeMsg]);
//   return <Navigate to="/login" replace />;
// }

export default App;
