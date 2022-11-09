import { useContext, useState, useRef } from "react";
import Boxes from "../../Contexts/Boxes";
//Nuotrauka
import getBase64 from "../../Functions/getBase64";
import DataContext from "../../Contexts/DataContext";

function Create() {
  const [title, setTitle] = useState("");
  const [weight, setWeight] = useState("");
  const [flame, setFlame] = useState("");
  const [perish, setPerish] = useState("");
  const [container, setContainer] = useState(0);
  //Nuotrauka
  const fileInput = useRef();
  const { makeMsg } = useContext(DataContext);

  const { setCreateData, containers } = useContext(Boxes);
  //Nuotrauka
  const [photoPrint, setPhotoPrint] = useState(null);
  //Nuotrauka
  const doPhoto = () => {
    getBase64(fileInput.current.files[0])
      .then((photo) => setPhotoPrint(photo))
      .catch((_) => {
        // tylim
      });
  };

  const add = () => {
    if (title.length === 0 || title.length > 30) {
      makeMsg('Please choose the item title between 1 and 30', 'error');
      return;
    } else if (weight > 200 || weight < 1) {
      makeMsg('Invalid weight. Please enter weight between 1 kg and 200 kg','error');
      return;
    }
    if (container === "" || flame === "" || perish === "") {
      makeMsg('You must choose all properties from select fields', 'error');
      return;
    } else
      setCreateData({
        title,
        weight,
        flame,
        perish,
        container_id: parseInt(container),
        //Nuotrauka
        image: photoPrint,
      });
    setTitle("");
    setWeight("");
    setFlame("");
    setPerish("");
    setContainer(0);
    //Nuotrauka
    setPhotoPrint(null);
    fileInput.current.value = null;
  };

  return (
    <div className="card m-4">
      <h5 className="card-header">New Box</h5>
      <div className="card-body">
        <div className="mb-3">
          <label className="form-label">Item Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
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
          <label className="form-label">Flammability</label>
          <select
            className="form-select"
            value={flame}
            onChange={(e) => setFlame(e.target.value)}
          >
            <option value={0}>Choose from list</option>
            {["Yes", "No"].map((ugnis, i) => (
              <option key={i} value={ugnis}>
                {ugnis}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Perishable</label>
          <select
            className="form-select"
            value={perish}
            onChange={(e) => setPerish(e.target.value)}
          >
            <option value={0}>Choose from list</option>
            {["Yes", "No"].map((perish, i) => (
              <option key={i} value={perish}>
                {perish}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="mb-3">
            <label className="form-label">Containers</label>
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
          </div>
          {/* Nuotrauka su input  */}
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
              <img src={photoPrint} alt="upload"></img>
            </div>
          ) : null}

          <button
            type="button"
            onClick={add}
            className="btn btn-outline-success"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default Create;
