import { useEffect, useState, useContext } from "react";
import Home from "../../Contexts/Home";

function Line({ container }) {
  const { setModalData } = useContext(Home);

  const [totalWeight, setTotalWeight] = useState(0);

  let n = 0;
  if (container[1][0].bid === null) {
    n = 0;
  } else {
    n = container[1].length;
  }

  useEffect(() => {
    container[1]?.forEach((b) => {
      setTotalWeight((prevW) => prevW + b.weight);
    });
  }, [container]);

  return (
    <li className="list-group-item">
      <div className="home">
        <div
          className="home__content__title click-link"
          onClick={() => setModalData(container)}
        >
          Container Number: {container[1][0].number}
        </div>
        <div className="home__content__title">
          Container Size: {container[1][0].size}
        </div>
        <div>Boxes in the container: {n}</div>
        <div>Total weight: {totalWeight} kg</div>
      </div>
    </li>
  );
}

export default Line;
