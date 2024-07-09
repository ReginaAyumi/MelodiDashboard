import React, { useEffect, useState } from 'react';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [timeFrame, setTimeFrame] = useState('daily');

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5001'); // Pastikan port sesuai dengan yang digunakan oleh WebSocket server

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
      const messageType = `INITIAL_${timeFrame.toUpperCase()}_RACE_DATA`;
      console.log('Sending message to server:', messageType);
      socket.send(JSON.stringify({ type: messageType }));
    };

    socket.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      console.log('Received data from server:', receivedData);
      if (receivedData.type === 'INITIAL_DATA' && receivedData.payload) {
        setData(receivedData.payload);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [timeFrame]);

  const handleTimeFrameChange = (newTimeFrame) => {
    setTimeFrame(newTimeFrame);
  };

  return (
    <div>
      <div>
        <button onClick={() => handleTimeFrameChange('minute')}>Minutes</button>
        <button onClick={() => handleTimeFrameChange('daily')}>Daily</button>
        <button onClick={() => handleTimeFrameChange('weekly')}>Weekly</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Negroid</th>
            <th>East Asian</th>
            <th>Indian</th>
            <th>Latin</th>
            <th>Middle Eastern</th>
            <th>South East Asian</th>
            <th>Kaukasia</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item._id}</td>
              <td>{item.totalNegroid}</td>
              <td>{item.totalEastAsian}</td>
              <td>{item.totalIndian}</td>
              <td>{item.totalLatin}</td>
              <td>{item.totalMiddleEastern}</td>
              <td>{item.totalSouthEastAsian}</td>
              <td>{item.totalKaukasia}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
