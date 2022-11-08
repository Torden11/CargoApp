import { useContext, useState } from "react";
import Containers from "../../Contexts/Containers";
import rand from "../../Functions/rand"

function Create() {
  const [number, setNumber] = useState('');
  const [size, setSize] = useState("");

  const { setCreateData } = useContext(Containers);

  const add = () => {
    setCreateData({
      number: "CA"+ rand(100, 999),
      size,
    });
    setNumber("");
    setSize("");
  };

  return (
    <div className="card m-4">
      <h5 className="card-header">New container</h5>
      <div className="card-body">
        {/* <div className="mb-3">
          <label className="form-label">Container Number</label>
          <input
            type="text"
            className="form-control"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div> */}
        <div className="mb-3">
          <label className="form-label">Container Size</label>
          <select
            className="form-select"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            <option value={0}>Choose from list</option>
            {["S", "M", "L"].map((dydis, i) => (
              <option key={i} value={dydis}>
                {dydis}
              </option>
            ))}
          </select>
        </div>
        <div>
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
