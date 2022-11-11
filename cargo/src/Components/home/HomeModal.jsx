import Home from "../../Contexts/Home";
import { useContext } from "react";

function HomeModal() {
  const { modalData, setModalData } = useContext(Home);
  console.log(modalData)
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
              <div className="home__content">
                <ul className="list-group">
                  <li className="home-group-item">
                    <div className="home_content_info">
                      <div>Box content: {modalData[1][0].title}</div>
                      <div>Box weight: {modalData[1][0].weight} kg</div>
                      <div>Flammable: {modalData[1][0].flammable}</div>
                      <div>Perishable: {modalData[1][0].perishable}</div>
                      <div className="img-bin">
                        <img
                          src={modalData[1][0].image}
                          alt={modalData[1][0].title}
                        ></img>
                      </div>
                    </div>
                  </li>
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
