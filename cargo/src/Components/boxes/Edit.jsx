import Boxes from "../../Contexts/Boxes";
import { useContext, useEffect, useState, useRef } from "react";
//Nuotrauka
import getBase64 from "../../Functions/getBase64";

function Edit() {
  const { modalData, setModalData, setEditData, containers } = useContext(Boxes);
  const [title, setTitle] = useState("");
  const [weight, setWeight] = useState("");
  const [container, setContainer] = useState(0);
  const [deletePhoto, setDeletePhoto] = useState(false);

  //Nuotrauka
  const fileInput = useRef();
//Nuotrauka
  const [photoPrint, setPhotoPrint] = useState(null);
//Nuotrauka
  const doPhoto = () => {
    getBase64(fileInput.current.files[0])
      .then((photo) => setPhotoPrint(photo))
      .containerch((_) => {
        // tylim
      });
  };

  //Zemiau rasome useEffect kad atsidarant edit langui uzsipyldytu visi langai esama info
  useEffect(() => {
    if (null === modalData) {
      return;
    }
    // console.log(modalData)
    setTitle(modalData.title);
    setWeight(modalData.weight);
    setContainer(modalData.container_id);
    //Nuotrauka
    setPhotoPrint(modalData.image);
    setDeletePhoto(false);
  }, [modalData]);

  //Zemiau rasome funkcija, kuri issaugotu musu naujai ivesta informacija
  const save = () => {
    setEditData({
      title,
      weight,
      container: parseInt(container),
      id: modalData.id,
      deletePhoto: deletePhoto ? 1 : 0,
      image: photoPrint
    });
    //Uzdarome modala. t.y. setititle ji null
    setModalData(null);
    setDeletePhoto(false);
  };

  if (null === modalData) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit movie</h5>
            <button
              onClick={() => setModalData(null)}
              type="button"
              className="btn-close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="card m-4">
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Item Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <div className="mb-3">
                    <label className="form-label">Box weight</label>
                    <input
                      type="text"
                      className="form-control"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Container</label>
                    <select
                      className="form-select"
                      value={container}
                      onChange={(e) => setContainer(e.target.value)}
                    >
                      <option value={0} disabled>
                        Choose from list
                      </option>
                      {containers?.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.number}
                        </option>
                      ))}
                    </select>
                    {/* Nuotrauka */}
                    <div className="mb-3">
                      <label className="form-label">Image</label>
                      <input
                        ref={fileInput}
                        type="file"
                        onChange={doPhoto}
                        className="form-control"
                      />
                    </div>
                    {photoPrint ? (
                      <div className="img-bin">
                        <div>
                          <input id="image-delete" type="checkbox" checked={deletePhoto} onChange={() => setDeletePhoto(d => !d)} />
                          <label htmlFor="image-delete">Delete photo</label>
                        </div>
                        <img src={photoPrint} alt="upload"></img>
                      </div>
                    ) : null}
                  </div>
                </div>
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
            <button onClick={save} type="button" className="btn btn-primary">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Edit;
