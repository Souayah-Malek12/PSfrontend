import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);  // Loading state

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      console.log('userRollele',user?.role )
      setUserRole(user?.role);  // Retrieve the role from the stored user data
    }
    setLoading(false);  // Once the role is set, set loading to false
  }, []);

  if (loading) {
    return null;  // or a loading spinner
  }

  return (
    <UserContext.Provider value={{ userRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserRole = () => useContext(UserContext);

export default UserContext;
