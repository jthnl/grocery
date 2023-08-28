import React from 'react';
import { Entry, GroceryList } from '../model/models';
import './ListCard.css'
interface ListCardProps {
  entry: Entry;
}

function ListCard({ entry }: ListCardProps) {
  const groceryList = entry.data as GroceryList;

  // Render the grocery list if it's defined and has items
  if (!groceryList || !groceryList.items || groceryList.items.length === 0) {
    return (
        <div className="list-card">
        <h2>New List</h2>
        <div className="data">
          <ul>
           
              <li className="item-content">
                <div className="drag-handle">&#x2630;</div>
                <label className="item-details">
                  <input type="checkbox" className="checkbox" checked={false} readOnly />
                  <p className="item-title">click to edit me</p>
                </label>
              </li>
          
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="list-card">
      <h2>{groceryList.title}</h2>
      <div className="data">
        <ul>
          {groceryList.items.map((item, index) => (
            <li className="item-content" key={index}>
              <div className="drag-handle">&#x2630;</div>
              <label className="item-details">
                <input type="checkbox" className="checkbox" checked={item.metadata.checkbox} readOnly />
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