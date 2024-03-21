import React, { useState } from 'react';

export const characteristic = true;

export const BluetoothButton = ({ magnet }) => {
  const [logMessage, setLogMessage] = useState('');

  const log = (message) => {
    setLogMessage((prevLog) => prevLog + '\n' + message);
  };

  const handleChange = (event) => {
    let change = event.target.value.getUint8(0);
    log('> Characteristics changed:  ' + change);
  };

  const requestBluetoothDevice = async () => {
    let options = {};
    options.filters = [{services: [0x00FF]}];
    options.optionalServices = [0x00FF];
    //options.acceptAllDevices = true;
    

    try {
      log('Requesting Bluetooth Device...');
      const device = await navigator.bluetooth.requestDevice(options);
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(0x00FF);
      let characteristic;
      let notifications;
      characteristic = await service.getCharacteristic(0xFF01);
      notifications = await service.getCharacteristic(0xFF02);
      notifications.addEventListener('characteristicvaluechanged', handleChange);
      log('> Name:             ' + device.name);
      log('> Id:               ' + device.id);
      log('> Connected:        ' + device.gatt.connected);
      log('> Characteristics     ' + notifications.value);
      let encoder = new TextEncoder('utf-8');
      try {
        log('> Notifying');
        await notifications.startNotifications();
        log('> Notifycation started');
        log('> Writing');
        await characteristic.writeValueWithResponse(encoder.encode("READ"));
        //console.log(magnet.instructions.join(' '))
        //await characteristic.writeValueWithResponse(encoder.encode(magnet.instructions.join(' ')));
      } catch(error) {
        log('Notifications! ' + error);
      }
    } catch (error) {
      log('Argh! ' + error);
    }
  };

  const doMove = async () => {
    let encoder = new TextEncoder('Uint8');
    try {
      log('> Writing');
      await characteristic.writeValueWithResponse(encoder.encode("MAGNET 1"));
    } catch(error) {
      log('Argh! ' + error);
    }
  };

  return (
    <div>
      <button onClick={requestBluetoothDevice}>Request Bluetooth Device</button>
      <pre>{logMessage}</pre>
      <button onClick={doMove}>doMove</button>
    </div>
  )
};

