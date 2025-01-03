import React from 'react';

interface LogoutButtonProps {
  logout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ logout }) => {
  return <button onClick={logout}>Logout</button>;
};

export default LogoutButton;
