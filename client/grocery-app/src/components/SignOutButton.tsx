// Simple Button to Sign Out

import React from 'react';
import '../styles/SignOutButton.css';

interface SignOutButtonProps {
  onSignOut: () => void;
}

function SignOutButton({ onSignOut }: SignOutButtonProps) {
  return (
    <button className="sign-out-button" onClick={onSignOut}>
      Sign Out
    </button>  );
}

export default SignOutButton;