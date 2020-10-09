import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';
import Modal from 'react-modal';

const HOST = "http://localhost:3001/";

function App() {

  // modal style
  const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };

  // state variables
  const[item, setItem] = useState("");
  const[editItem, setEditItem] = useState("");
  const[itemList, setItemList] = useState([]);
  const[editModalOpen, setEditModalOpen] = useState(false);
  const[deleteModalOpen, setDeleteModalOpen] = useState(false);
  const[itemID, setItemID] = useState("");
  
  // axios API calls
  const createNewItem = () => {
    axios.post(HOST + 'insert', {
      item : item
    })
    .then((response) => {
      setItem("");
      setItemList([response.data, ...itemList])
    }, (error) => {
      console.log(error);
    });
  }

  const updateItem = (id) => {
    axios.put(HOST + 'update', {
      id : id,
      item : editItem
    })
    .then((response) => {
      setEditModalOpen(false);
      const currentItemIndex = itemList.findIndex(item => item._id === id);
      const tempItemList = [...itemList];
      tempItemList[currentItemIndex] = { ...tempItemList[currentItemIndex], item: editItem };
      setItemList([...tempItemList]);
      console.log(response);
    }, (error) => {
      console.log(error);
    });
  }

  const deleteItem = (id) => {
    axios.delete(HOST + `delete/${id}`)
    .then((response) => {
      setDeleteModalOpen(false);
      setItemList(itemList.filter(item => item._id !== id))
    }, (error) => {
      console.log(error);
    });;
  }

  // use effect
  useEffect(() => {
    const fetchItems = async() => {
      const response = await axios(HOST + 'read');
      if(response){
        setItemList(response.data);
        console.log(response);
      }
    };
    fetchItems();
  }, []);

  // helper functions
  const onClickDelete = (id) => {
    setDeleteModalOpen(true);
    setItemID(id);
  }

  const onClickEdit = (id, name) => {
    setEditModalOpen(true);
    setItemID(id);
  }

  return (
    <>
      <div className="container-wrapper">
        <div className="app-header-container">
          <h1 className="app-header">To do list</h1>
        </div>
        <form>
          <div className = "add-input-container">
            <input
              className="add-textfield"
              type="text"
              placeholder="Add an item"
              onChange={(event) => {setItem(event.target.value)}}
              onKeyDown={(event) => {
                if(event.key === 'Enter') {
                  setItem(event.target.value)
                }
              }}
            />
            <button type="reset" className="add-button" onClick={createNewItem} >Add</button>
          </div>
        </form>
        <div>
          {itemList.map((val, key) => {
             return <div className="display-item-container" key = {key}>
             
                        <span className="display-item">{val.item}</span>
                        <button onClick={() => { onClickEdit(val._id, val.item); setEditItem(val.item) }} className="btn edit"><i className="fa fa-pencil" ></i></button>
                        <button onClick={() => onClickDelete(val._id)} className="btn delete"><i className="fa fa-trash"></i></button>
                        
                        <Modal isOpen = {editModalOpen} style={customStyles}>
                          <div className="modal-container edit">
                            <h1>Edit item</h1>
                            <input 
                              type="text"
                              onChange={(event) => {setEditItem(event.target.value)}}
                              value={editItem}
                            >
                            </input>
                            <button onClick={() => updateItem(itemID)}>Save changes</button>
                            <button onClick={() => setEditModalOpen(false)} className="close-button" ><i className="fa fa-times"></i></button>
                        </div>
                      </Modal>

                      <Modal isOpen = {deleteModalOpen} style={customStyles}>
                          <div className="modal-container delete">
                            <h1>Delete item?</h1>
                            <div className="button-container">
                              <button className="button-no" onClick={() => setDeleteModalOpen(false)}>No</button>
                              <button className="button-yes" onClick={() => deleteItem(itemID)}>Yes</button>
                            </div>
                        </div>
                      </Modal>

                    </div>
          })}
        </div>
      </div>

    </>
  );


}

export default App;
