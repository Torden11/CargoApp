import Home from "../../Contexts/Home";
import List from "./List";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { authConfig } from "../../Functions/auth";

function Main() {
  
  const [containers, setContainers] = useState(null);
  //const [boxes, setBoxes] = useState(null);
  const filterOn = useRef(false);
  const filterWhat = useRef(null);

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

  // READ for list
  useEffect(() => {
    axios.get("http://localhost:3003/home/containers", authConfig()).then((res) => {
      console.log(reList(res.data));
      setContainers(reList(res.data));
    });
  }, []);

  // READ for list
  // useEffect(() => {
  //   axios.get("http://localhost:3003/home/boxes", authConfig()).then((res) => {
  //     if (filterOn.current) {
  //       setBoxes(
  //         res.data.map((d, i) =>
  //           filterWhat.current === d.cat_id
  //             ? { ...d, show: true, row: i }
  //             : { ...d, show: false, row: i }
  //         )
  //       );
  //     } else {
  //       setBoxes(res.data.map((d, i) => ({ ...d, show: true, row: i })));
  //     }
  //   });
  // });

  

  return (
    <Home.Provider
      value={{
        //boxes,
        //setBoxes,
        containers,
        filterOn,
        filterWhat,
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col col-lg-12 col-md-12 col-sm-12">
            <List />
          </div>
        </div>
      </div>
    </Home.Provider>
  );
}

export default Main;
