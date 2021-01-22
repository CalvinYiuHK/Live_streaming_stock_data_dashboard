import "./App.css";
import React, {useEffect, useState} from "react";
import SocketIOClient from "socket.io-client";
import AGGrid from "./AGGrid";
import updateGridRows, {Row} from "./updateGridRows";
import {PORT, URL} from "./constants"

function App() {
  const [socket, setSocket] = useState<SocketIOClient.Socket>();
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    const url = `${URL}:${PORT}/broadcast`;
    const socket = SocketIOClient(url);

    // Logs a message when it connect to server.
    socket.on("connect", () => console.log("Sever connected."));
    // Logs a message when it disconnected from server.
    socket.on("disconnect", () => console.log("Server disconnected."));
    socket.on("serverResponse", (response: string) => {
      // update the data grid by using the received update
      const rowUpdates: Row[] = JSON.parse(response);
      setRows(prevState => {
        return updateGridRows(prevState, rowUpdates);
      })
    });
    setSocket(socket);
  }, []);

  return (
    <div className="App">
      <AGGrid rows={rows}/>
    </div>
  );
}

export default App;
