import { useEffect } from "react";
import { useState } from "react";
import Boxes from "../../Contexts/Boxes";
import Create from "./Create";
import axios from "axios";
import List from "./List";
import Edit from "./Edit";
import { authConfig } from "../../Functions/auth";

function Main() {
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [createData, setCreateData] = useState(null);
  const [boxes, setBoxes] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [editData, setEditData] = useState(null);

  const [containers, setContainers] = useState(null);

  // READ for select
  useEffect(() => {
   axios.get('http://localhost:3003/server/containers', authConfig())
       .then(res => {
           setContainers(res.data);
       })
}, []);


// READ for list
useEffect(() => {
   axios.get('http://localhost:3003/server/boxes',authConfig())
       .then(res => {
         setBoxes(res.data);
       })
}, [lastUpdate]);

useEffect(() => {
   if (null === createData) {
       return;
   }
   axios.post('http://localhost:3003/server/boxes', createData, authConfig())
       .then(res => {
        console.log(createData)
           setLastUpdate(Date.now());
       });
}, [createData]);


  useEffect(() => {
    if (null === deleteData) {
      return;
    }
    axios
      .delete("http://localhost:3003/server/boxes/" + deleteData.id, authConfig())
      .then((res) => {
        setLastUpdate(Date.now());
      });
  }, [deleteData]);

  useEffect(() => {
    if (null === editData) {
      return;
    }console.log(editData.id, editData)
    axios
      .put("http://localhost:3003/server/boxes/" + editData.id, editData, authConfig())
      .then((res) => {
        setLastUpdate(Date.now());
      });
  }, [editData]);

  return (
    <Boxes.Provider
      value={{
        containers,
        setCreateData,
        boxes,
        setDeleteData,
        modalData,
        setModalData,
        setEditData
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-4">
            <Create />
          </div>
          <div className="col-8">
            <List></List>
          </div>
        </div>
      </div>
      <Edit></Edit>
    </Boxes.Provider>
  );
}

export default Main;
