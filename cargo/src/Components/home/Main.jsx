import Home from "../../Contexts/Home";
import List from "./List";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { authConfig } from "../../Functions/auth";

function Main() {
  
  const [boxes, setBoxes] = useState(null);
  const filterOn = useRef(false);
  const filterWhat = useRef(null);

  // READ for list
  useEffect(() => {
    axios.get("http://localhost:3003/home/boxes", authConfig()).then((res) => {
      if (filterOn.current) {
        setBoxes(
          res.data.map((d, i) =>
            filterWhat.current === d.cat_id
              ? { ...d, show: true, row: i }
              : { ...d, show: false, row: i }
          )
        );
      } else {
        setBoxes(res.data.map((d, i) => ({ ...d, show: true, row: i })));
      }
    });
  });

  

  return (
    <Home.Provider
      value={{
        boxes,
        setBoxes,
        filterOn,
        filterWhat,
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <List />
          </div>
        </div>
      </div>
    </Home.Provider>
  );
}

export default Main;
