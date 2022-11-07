import { useContext } from "react";
import Boxes from "../../Contexts/Boxes";
import Line from "./Line";

function List() {
  const { boxes } = useContext(Boxes);

  return (
    <div className="card m-4">
      <h5 className="card-header">Boxes list</h5>
      <div className="card-body">
        <ul className="list-group">
          {boxes?.map(b => (
            <Line key={b.id} box={b} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default List;
