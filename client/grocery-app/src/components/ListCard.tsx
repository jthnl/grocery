import React from "react";
import { Entry, GroceryList } from "../model/models";
import "../styles/ListCard.css";
interface ListCardProps {
  entry: Entry;
}

function ListCard({ entry }: ListCardProps) {
  const groceryList = entry.data as GroceryList;

  // if GroceryList item is malformed or new, render default messages
  if (!groceryList || !groceryList.items || groceryList.items.length === 0) {
    return (
      <div className="list-card">
        <h2>{groceryList.title ? groceryList.title : "New List"}</h2>
        <div className="data">
          <ul>
            <li className="item-content">
              <div className="drag-handle">&#x2630;</div>
              <label className="item-details">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={false}
                  readOnly
                />
                <p className="item-title">click to edit me</p>
              </label>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  // render listCard
  return (
    <div className="list-card">
      <h2>{groceryList.title}</h2>
      <div className="data">
        <ul>
          {groceryList.items.map((item, index) => (
            <li className="item-content" key={index}>
              <div className="drag-handle">&#x2630;</div>
              <label className="item-details">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={item.metadata.checkbox}
                  readOnly
                />
                <p className="item-title">{item.title}</p>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ListCard;
