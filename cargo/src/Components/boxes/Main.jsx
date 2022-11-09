import { useEffect } from "react";
import { useState, useContext } from "react";
import Boxes from "../../Contexts/Boxes";
import Create from "./Create";
import axios from "axios";
import List from "./List";
import Edit from "./Edit";
import { authConfig } from "../../Functions/auth";
import DataContext from "../../Contexts/DataContext";

function Main() {
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [createData, setCreateData] = useState(null);
  const [boxes, setBoxes] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [editData, setEditData] = useState(null);

  const [containers, setContainers] = useState(null);
  const { makeMsg } = useContext(DataContext);

  // READ for select of containers for admin in BOXES
  useEffect(() => {
   axios.get('http://localhost:3003/server/containers', authConfig())
       .then(res => {
           setContainers(res.data);
       })
}, []);


// READ BOX for admin
useEffect(() => {
   axios.get('http://localhost:3003/server/boxes',authConfig())
       .then(res => {
         setBoxes(res.data);
       })
}, [lastUpdate]);

//CREATE BOX for admin
useEffect(() => {
   if (null === createData) {
       return;
   }
   axios.post('http://localhost:3003/server/boxes', createData, authConfig())
       .then(res => {
           setLastUpdate(Date.now());
           makeMsg(res.data.text, res.data.type);
       });
}, [createData, makeMsg]);

//DELETE of BOX for admin
  useEffect(() => {
    if (null === deleteData) {
      return;
    }
    axios
      .delete("http://localhost:3003/server/boxes/" + deleteData.id, authConfig())
      .then((res) => {
        setLastUpdate(Date.now());
        makeMsg(res.data.text, res.data.type);
      });
  }, [deleteData, makeMsg]);

  //UPDATE of BOX for ADMIN
  useEffect(() => {
    if (null === editData) {
      return;
    }
    axios
      .put("http://localhost:3003/server/boxes/" + editData.id, editData, authConfig())
      .then((res) => {
        setLastUpdate(Date.now());
        makeMsg(res.data.text, res.data.type);
      });
  }, [editData, makeMsg]);

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
