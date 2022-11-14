import { useContext } from "react";
import Boxes from "../../Contexts/Boxes";

function Line({ box }) {
  const { setDeleteData, setModalData, containers } = useContext(Boxes);

  return (
    <li className="list-group-item">
      <div className="line">
        <div className="line__content">
          {/* Nuotrauka pradzia */}
          <div className="line__content__title">
            {box.image ? (
              <div className="img-bin">
                <img src={box.image} alt={box.title}></img>
              </div>
            ) : (
              <span className="red-image">No image</span>
            )}
          </div>
          {/* Nuotrauka pabaiga */}
          <div className="line__content__title">{box.title}</div>
          <div className="line__content__info">{box.weight} kg</div>
          <div className="line__content__info">Flammable: {box.flammable}</div>
          <div className="line__content__info">Perishable: {box.perishable}</div>
          <div className="line__content__info">
            Container ID: {containers.find((c) => c.id === box.container_id)?.number}
          </div>
        </div>
        <div className="line__buttons">
          <button
            onClick={() => setModalData(box)}
            type="button"
            className="btn btn-outline-success"
          >
            Edit
          </button>
          <button
            onClick={() => setDeleteData(box)}
            type="button"
            className="btn btn-outline-danger"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}

export default Line;
