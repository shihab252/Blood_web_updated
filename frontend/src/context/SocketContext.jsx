import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    // Initialize Socket connection
    const newSocket = io("http://localhost:5000"); // Backend URL
    setSocket(newSocket);

    // Register the user ID for targeted notifications
    if (user && user._id) {
      newSocket.emit("registerUser", user._id);
    }

    // Listen for incoming blood requests
    newSocket.on("newRequest", (data) => {
      // You can replace this with a beautiful Toast notification later
      alert(`URGENT: ${data.bloodGroup} blood needed for ${data.patientName} at ${data.hospital}!`);
    });

    // Listen for donor acceptance (For Requesters)
    newSocket.on("donorAccepted", (data) => {
      alert(`GOOD NEWS: ${data.donorName} has accepted your request!`);
    });

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
