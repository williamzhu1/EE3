import React, { useState } from 'react';

export const BluetoothButton = () => {
  const [logMessage, setLogMessage] = useState('');

  const log = (message) => {
    setLogMessage((prevLog) => prevLog + '\n' + message);
  };
  const requestBluetoothDevice = async () => {
    let options = {};
    options.optionalServices = [0x180D];
    //options.acceptAllDevices = true;
    options.filters = [{services: [0x00EE]}];

    try {
      log('Requesting Bluetooth Device...');
      const device = await navigator.bluetooth.requestDevice(options);
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(0x180D);
      let characteristics;
      characteristics = await service.getCharacteristics(0x2A38);
      log('> Name:             ' + device.name);
      log('> Id:               ' + device.id);
      log('> Connected:        ' + device.gatt.connected);
      log('> Characteristics     ' + characteristics);
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
