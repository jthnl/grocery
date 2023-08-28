import React from 'react';
import { authApi } from '../services/api'; // Import the new authApi

interface SignOutButtonProps {
  onSignOut: () => void;
}

function SignOutButton({ onSignOut }: SignOutButtonProps) {
  const handleSignOut = async () => {
    try {
      await authApi.logout(); // Use the new authApi.logout function
      onSignOut(); // Call the provided callback to handle sign out logic
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  return (
    <button onClick={handleSignOut}>Sign Out</button>
  );
}

export default SignOutButton;