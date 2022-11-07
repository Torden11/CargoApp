import { useState } from "react";
import { useContext, useEffect } from "react";
import Home from "../../Contexts/Home";
import Line from "./Line";



function List() {
  const { boxes, setBoxes, filterOn, filterWhat } = useContext(Home);
  const [stats, setStats] = useState({movieCount: null});

  const resetFilter = () => {
    setBoxes((b) => b.map((bo) => ({ ...bo, show: true })));
    filterOn.current = false;
    filterWhat.current = null;
  };

  useEffect (() => {
    if(null === boxes) {
        return;
    }
    setStats(s => ({...s, boxCount: boxes.length}));
  }, [boxes]);

  

  
  return (
    <>
      <div className="card m-4">
        <h5 className="card-header">
          Containers List  <small onClick={resetFilter}>Show all containers</small>
          <span>Total number of boxes: ({stats.boxCount})</span>
        </h5>
        <div className="card-body">
          <ul className="list-group">
            {boxes?.map((b) =>
              b.show ? <Line key={b.id} box={b} /> : null
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default List;
