import React, { useState } from 'react';

export const BluetoothButton = () => {
  const [logMessage, setLogMessage] = useState('');

  const log = (message) => {
    setLogMessage((prevLog) => prevLog + '\n' + message);
  };
  const requestBluetoothDevice = async () => {
    let options = {};
    options.acceptAllDevices = true;

    try {
      log('Requesting Bluetooth Device...');
      const device = await navigator.bluetooth.requestDevice(options);
      device.gatt.connect();
      log('> Name:             ' + device.name);
      log('> Id:               ' + device.id);
      log('> Connected:        ' + device.gatt.connected);
    } catch (error) {
      log('Argh! ' + error);
    }
  };

  return (
    <div>
      <button onClick={requestBluetoothDevice}>Request Bluetooth Device</button>
      <pre>{logMessage}</pre>
    </div>
  )
};
