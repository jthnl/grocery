import React, { useState, useEffect } from "react";
import { Entry, ListItem, GroceryList } from "../model/models";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./Droppable";
import { api } from "../services/api";

import "./Modal.css";

interface ModalProps {
  entry: Entry;
  onClose: () => void;
  onSave: (updatedData: Entry) => void;
  onDelete: (listId: string) => void;
}

const Modal: React.FC<ModalProps> = ({ entry, onClose, onSave, onDelete }) => {
  const selectedGroceryList: GroceryList = entry.data as GroceryList;

  const [editedTitle, setEditedTitle] = useState(
    selectedGroceryList.title || ""
  );
  const [editedItems, setEditedItems] = useState<ListItem[]>(
    selectedGroceryList.items || []
  );
  const [newItemTitle, setNewItemTitle] = useState("");

  const [entryHistory, setEntryHistory] = useState<Entry[]>([]);
  const [currentVersionIndex, setCurrentVersionIndex] = useState<number>(0);


  useEffect(() => {
    fetchEntryHistory(entry.listId);
  }, [entry.listId]);

  useEffect(() => {
    if (entryHistory.length > 0) {
      const versionData = entryHistory[currentVersionIndex].data as GroceryList;
      setEditedTitle(versionData.title || "");
      setEditedItems(versionData.items || []);
    }
  }, [entryHistory, currentVersionIndex]);


    // Fetch entry history from the server
    const fetchEntryHistory = async (listId: string) => {
        try {
          const history = await api.getEntryHistory(listId);
          setEntryHistory(history);
        } catch (error) {
          console.error("Error fetching entry history:", error);
        }
      };
    

      const handlePreviousVersion = () => {
        if (currentVersionIndex > 0) {
          setCurrentVersionIndex(currentVersionIndex - 1);
        }
      };
    
      const handleNextVersion = () => {
        if (currentVersionIndex < entryHistory.length - 1) {
          setCurrentVersionIndex(currentVersionIndex + 1);
        }
      };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleItemTitleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedItems = [...editedItems];
    updatedItems[index].title = event.target.value;
    setEditedItems(updatedItems);
  };

  const handleCheckboxToggle = (index: number) => {
    const updatedItems = [...editedItems];
    updatedItems[index].metadata.checkbox =
      !updatedItems[index].metadata.checkbox;
    setEditedItems(updatedItems);
  };

  const handleAddNewItem = () => {
    if (newItemTitle.trim() !== "") {
      const newItem: ListItem = {
        title: newItemTitle,
        metadata: { checkbox: false },
      };
      setEditedItems([...editedItems, newItem]);
      setNewItemTitle("");
    }
  };

  const handleNewItemTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewItemTitle(event.target.value);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const reorderedItems = Array.from(editedItems);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setEditedItems(reorderedItems);
  };

  const handleSaveChanges = () => {
    const updatedItems = [...editedItems];
  
    if (newItemTitle.trim() !== "") {
      const newItem: ListItem = {
        title: newItemTitle,
        metadata: { checkbox: false },
      };
      updatedItems.push(newItem);
    }
  
    const updatedData: Entry = {
      ...entry,
      data: {
        title: editedTitle,
        items: updatedItems,
      },
    };
  
    onSave(updatedData);
    onClose();
  };

  const handleNewItemKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && newItemTitle.trim() !== "") {
      const newItem = {
        title: newItemTitle,
        metadata: { checkbox: false },
      };
      setEditedItems([...editedItems, newItem]);
      setNewItemTitle("");
    }
  };

  const handleDeleteItem = (indexToDelete: number) => {
    const updatedItems = editedItems.filter(
      (_, index) => index !== indexToDelete
    );
    setEditedItems(updatedItems);
  };

  

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>
          Close
        </button>
        <input
          className="modal-title-editable"
          type="text"
          value={editedTitle}
          onChange={handleTitleChange}
          placeholder="Add Title"
        />
        <div className="modal-items">
          <DragDropContext onDragEnd={handleDragEnd}>
            <StrictModeDroppable droppableId="droppable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {editedItems.map((item, index) => (
                    <Draggable
                      key={index}
                      draggableId={index.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="draggable-item"
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                        >
                          <div className="item-content">
                            <div
                              className="drag-handle"
                              {...provided.dragHandleProps}
                            >
                              &#x2630;
                            </div>
                            <div className="item-details">
                              <input
                                type="checkbox"
                                className="checkbox"
                                checked={item.metadata.checkbox}
                                onChange={() => handleCheckboxToggle(index)}
                              />
                              <input
                                className="item-title"
                                type="text"
                                value={item.title}
                                onChange={(event) =>
                                  handleItemTitleChange(index, event)
                                }
                              />
                              <div
                                className="delete-button"
                                onClick={() => handleDeleteItem(index)}
                              >
                                &times;
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <div className="item-content">
                    <div className="drag-handle">&#x2630;</div>
                    <div className="item-details">
                      <input
                        className="checkbox"
                        type="checkbox"
                        checked={false}
                        onChange={() => {}}
                      />
                      <input
                        className="item-title"
                        type="text"
                        placeholder="+"
                        value={newItemTitle}
                        onChange={handleNewItemTitleChange}
                        onKeyDown={(event) => handleNewItemKeyDown(event)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </StrictModeDroppable>
          </DragDropContext>
        </div>
        <div className="modal-footer">
        <button className="modal-button" onClick={handleNextVersion}>
            &#8249;
          </button>
          <button className="modal-button" onClick={handlePreviousVersion}>
            &#8250;
          </button>
          <button className="modal-delete" onClick={() => onDelete(entry.listId)}>
            Delete
          </button>
          <div className="button-spacer" /> 
          <button className="modal-save" onClick={handleSaveChanges}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
