import { useContext } from "react";
import Cats from "../../Contexts/Cats";



function LineCat({ cat }) {

  const { setDeleteData, setModalData } = useContext(Cats);

  return (
    <li className="list-group-item">
      <div className="line">
        <div className="line_content">
          <div className="line_content_title">{cat.title}</div>
        </div>
        <div className="line_buttons">
          <button onClick={() => setModalData(cat)} type="button" className="btn btn-outline-success">
            Edit
          </button>
          <button onClick={() => setDeleteData(cat)} type="button" className="btn btn-outline-danger">
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}

export default LineCat;
