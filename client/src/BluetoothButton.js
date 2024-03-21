import React, { useState } from 'react';

export const characteristic = true;

export const BluetoothButton = () => {
  const [logMessage, setLogMessage] = useState('');
  const [moveValue, setMoveValue] = useState('');
  const [bluetoothCharacteristic, setBluetoothCharacteristic] = useState(null);

  const log = (message) => {
    setLogMessage((prevLog) => prevLog + '\n' + message);
  };
  
  const handleChange = (event) => {
    let change = event.target.value.getUint64();
    log('> Characteristics changed:  ' + change);
  };

  const handleMoveInputChange = (event) => {
    setMoveValue(event.target.value);
  };


  const requestBluetoothDevice = async () => {
    let options = {};
    options.optionalServices = [0x00FF];
    //options.acceptAllDevices = true;
    options.filters = [{services: [0x0FF]}];

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
      setBluetoothCharacteristic(characteristic);
      log('> Name:             ' + device.name);
      log('> Id:               ' + device.id);
      log('> Connected:        ' + device.gatt.connected);
      log('> Characteristics     ' + characteristic.value);
      //let encoder = new TextEncoder('utf-8');
      try {
        log('> Notifying');
        await notifications.startNotifications();
        log('> Notifycation started');
        log('> Writing');
        var hex = '0x3FFFFFFFFFF'
        var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
          return parseInt(h, 16)
        }))
        //await characteristic.writeValueWithResponse(typedArray);
      } catch(error) {
        log('Argh! ' + error);
      }
    } catch (error) {
      log('Argh! ' + error);
    }
  };
  
  const doMove = async () => {
    if (!bluetoothCharacteristic) {
      log('Bluetooth characteristic not available');
      return;
    }
    try {
      log('> Writing');
      var typedArray = new Uint8Array(moveValue.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
      }))
      await bluetoothCharacteristic.writeValueWithResponse(typedArray);
    } catch(error) {
      log('Argh! ' + error);
    }
  };

  return (
    <div>
      <button onClick={requestBluetoothDevice}>Request Bluetooth Device</button>
      <pre>{logMessage}</pre>
      <input type="text" value={moveValue} onChange={handleMoveInputChange} />
      <button onClick={doMove}>doMove</button>
    </div>
  )
};

