// Dashboard - main application page
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ListCard from "./ListCard";
import Modal from "./Modal";
import SignOutButton from "./SignOutButton";
import { Entry, GroceryList } from "../model/models";
import { api } from "../services/api";
import "../styles/Dashboard.css";

function Dashboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchListEntries();
  }, []);

  // external calls
  const fetchListEntries = async () => {
    try {
      const data = await api.getListEntries();
      setEntries(data);
    } catch (error) {
      console.error("Error fetching list entries:", error);
    }
  };

  // event handlers
  const handleEditClick = (entry: Entry) => {
    setSelectedEntry(entry);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setSelectedEntry(null);
    setModalVisible(false);
  };

  const handleSignOut = async () => {
    try {
      await api.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleModalSave = async (updatedData: Entry) => {
    try {
      const updatedGroceryList: GroceryList = updatedData.data as GroceryList;
      await api.updateListEntry(
        { entryId: updatedData.entryId },
        updatedGroceryList
      );
      fetchListEntries();
    } catch (error) {
      console.error("Error updating list:", error);
    }
    handleModalClose();
  };

  const handleNewListClick = async () => {
    try {
      await api.createNewList();
      fetchListEntries();
    } catch (error) {
      console.error("Error creating new list:", error);
    }
  };

  const handleModalDelete = async (listId: string) => {
    try {
      const success = await api.deleteList(listId);
      if (success) {
        fetchListEntries();
        setSelectedEntry(null);
        setModalVisible(false);
      } else {
        console.error('Error deleting list');
      }
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <SignOutButton onSignOut={handleSignOut} />
      </div>
      <div className="dashboard-body">
        <div className="list-cards-container">
          {entries.map((entry) => (
            <div key={entry.entryId} onClick={() => handleEditClick(entry)}>
              <ListCard entry={entry} />
            </div>
          ))}
        </div>
        <button className="add-new-list-button" onClick={handleNewListClick}>
          Add New List
        </button>
      </div>
      {modalVisible && selectedEntry && (
        <Modal
          entry={selectedEntry}
          onClose={handleModalClose}
          onSave={handleModalSave}
          onDelete={handleModalDelete}
        />
      )}
    </div>
  );
}
export default Dashboard;
