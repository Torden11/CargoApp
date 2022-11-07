import { useContext } from "react";
import Movies from "../../Contexts/Movies";

function LineMovie({ movie }) {
  const { setDeleteData, setModalData, cats } = useContext(Movies);

  return (
    <li className="list-group-item">
      <div className="line">
        <div className="line_content">
          {/* Nuotrauka pradzia */}
          <div className="line_content_title">
            {movie.image ? (
              <div className="img-bin">
                <img src={movie.image} alt={movie.title}></img>
              </div>
            ) : (
              <span className="red-image">No image</span>
            )}
          </div>
          {/* Nuotrauka pabaiga */}
          <div className="line_content_title">{movie.title}</div>
          <div className="line_content_price">{movie.price} EUR</div>
          <div className="line_content_price">
            {movie.rating ?? "no rating"}
          </div>
          <div className="line__content__info">
            {cats.find((c) => c.id === movie.cat_id)?.title}
          </div>
        </div>
        <div className="line_buttons">
          <button
            onClick={() => setModalData(movie)}
            type="button"
            className="btn btn-outline-success"
          >
            Edit
          </button>
          <button
            onClick={() => setDeleteData(movie)}
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

export default LineMovie;
