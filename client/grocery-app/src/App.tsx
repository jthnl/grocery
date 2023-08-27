import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState({});
  const [lists, setLists] = useState([]);

  useEffect(() => {
    // Fetch user based on email
    fetch('/api/getUser/user@example.com')
      .then(response => response.json())
      .then(data => setUser(data));

    // Fetch lists for a user
    fetch('/api/getLists/user_id_here')
      .then(response => response.json())
      .then(data => setLists(data));
  }, []);

  return (
    <div className="App">
      <h1>User Information</h1>
      <p>User ID: {user.userId}</p>
      <p>First Name: {user.firstName}</p>
      <p>Last Name: {user.lastName}</p>
      <p>Email: {user.email}</p>

      <h1>User's Lists</h1>
      <ul>
        {lists.map(list => (
          <li key={list.listId}>List ID: {list.listId}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;