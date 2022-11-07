import { useContext } from "react";
import Containers from "../../Contexts/Containers";



function Line({ container }) {

  const { setDeleteData, setModalData } = useContext(Containers);

  return (
    <li className="list-group-item">
      <div className="line">
      <div className="line_content">
          <div className="line_content_title">Number: {container.number}</div>
        </div>
        <div className="line_content">
          <div className="line_content_title">Size: {container.size}</div>
        </div>
        <div className="line_buttons">
          <button onClick={() => setModalData(container)} type="button" className="btn btn-outline-success">
            Edit
          </button>
          <button onClick={() => setDeleteData(container)} type="button" className="btn btn-outline-danger">
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}

export default Line;
