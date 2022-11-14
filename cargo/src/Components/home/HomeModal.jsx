import Home from "../../Contexts/Home";
import { useContext } from "react";

function HomeModal() {
  const { modalData, setModalData } = useContext(Home);
  console.log(modalData);
  if (null === modalData) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Container contents</h5>
            <button
              onClick={() => setModalData(null)}
              type="button"
              className="btn-close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="card m-4">
              <div className="card-body">
                <ul className="list-group">
                  {modalData[1]?.map((b) => (
                    <li key={b.bid} className="home-group-item">
                      <div className="home__content__modal">
                        <div>Box content: {b.title}</div>
                        <div>Box weight: {b.weight} kg</div>
                        <div>Flammable: {b.flammable}</div>
                        <div>Perishable: {b.perishable}</div>
                        <div className="line_content_title">
                          {b.image ? (
                            <div className="img-bin">
                              <img src={b.image} alt={b.title}></img>
                            </div>
                          ) : (
                            <span className="red-image">No image</span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              onClick={() => setModalData(null)}
              type="button"
              className="btn btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeModal;
