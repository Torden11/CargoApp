import { useState } from "react";
import { useContext, useEffect } from "react";
import Home from "../../Contexts/Home";
import Line from "./Line";



function List() {
  const { containers, filterOn, filterWhat } = useContext(Home);
  // const [stats, setStats] = useState({boxCount: null});

  // const resetFilter = () => {
  //   setBoxes((b) => b.map((bo) => ({ ...bo, show: true })));
  //   filterOn.current = false;
  //   filterWhat.current = null;
  // };

  // useEffect (() => {
  //   if(null === boxes) {
  //       return;
  //   }
  //   setStats(s => ({...s, boxCount: boxes.length}));
  // }, [boxes]);

  

  
  return (
    <>
      <div className="card m-4">
        <h5 className="card-header">
          Containers List  
          {/* <small onClick={resetFilter}>Show all containers</small>
          <span>Total number of boxes: ({stats.boxCount})</span> */}
        </h5>
        <div className="card-body">
          <ul className="list-group">
            {containers?.map((c) =>
              <Line key={c[1][0].id} container={c} />
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default List;
