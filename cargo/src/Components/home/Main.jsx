import Home from "../../Contexts/Home";
import List from "./List";
import HomeModal from "./HomeModal";
import { useState, useEffect } from "react";
import axios from "axios";
import { authConfig } from "../../Functions/auth";

function Main() {
  
  const [containers, setContainers] = useState(null);
  const [modalData, setModalData] = useState(null);
  

  

  const reList = (data) => {
    const d = new Map();
    data.forEach((line) => {
      if (d.has(line.id)) {
        d.set(line.id, [...d.get(line.id), line]);
      } else {
        d.set(line.id, [line]);
      }
    });
    return [...d];
  };

  // READ for list for all containers
  useEffect(() => {
    axios.get("http://localhost:3003/home/containers", authConfig()).then((res) => {
      //console.log(reList(res.data));
      setContainers(reList(res.data));
    });
  }, []);

  

  
  return (
    <Home.Provider
      value={{
        containers,
        modalData,
        setModalData,
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col col-lg-12 col-md-12 col-sm-12">
            <List />
          </div>
        </div>
      </div>
      <HomeModal></HomeModal>
    </Home.Provider>
  );
}

export default Main;
