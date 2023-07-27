import React, { useState, useEffect } from 'react';

const ControllerConfig = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState(null);
  const [calibration, setCalibration] = useState({
    pedal: { min: null, max: null },
    brake: { min: null, max: null },
    wheel: { min: null, max: null },
  });
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationValues, setCalibrationValues] = useState([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const gamepads = navigator.getGamepads();
      setDevices(gamepads);

      if (isCalibrating && selectedDeviceIndex !== null) {
        const device = gamepads[selectedDeviceIndex];
        setCalibrationValues(device.axes);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [isCalibrating, selectedDeviceIndex]);

  const handleDeviceChange = (e) => {
    setSelectedDeviceIndex(e.target.value);
  };

  const startCalibration = (inputType) => {
    setIsCalibrating(inputType);
    setCalibrationValues([]);
  };

  const stopCalibration = () => {
    const minMax = {
      min: Math.min(...calibrationValues),
      max: Math.max(...calibrationValues),
    };
    setIsCalibrating(false);
    setCalibration((prev) => ({
      ...prev,
      [isCalibrating]: minMax,
    }));
  };

  return (
    <div>
      <h2>Controller Config</h2>
      <label>
        Select Device:
        <select onChange={handleDeviceChange}>
          <option value={null}>None</option>
          {devices.map((device, index) =>
            device ? (
              <option key={index} value={index}>
                {device.id}
              </option>
            ) : null
          )}
        </select>
      </label>
      {selectedDeviceIndex != null &&
        (isCalibrating ? (
          <div>
            Calibration values: {JSON.stringify(calibrationValues)}
            <button onClick={stopCalibration}>Set Range</button>
          </div>
        ) : (
          <>
            <button onClick={() => startCalibration('pedal')}>Calibrate Pedal</button>
            <button onClick={() => startCalibration('brake')}>Calibrate Brake</button>
            <button onClick={() => startCalibration('wheel')}>Calibrate Wheel</button>
          </>
        ))}
      <pre>{JSON.stringify(calibration, null, 2)}</pre>
    </div>
  );
};

export default ControllerConfig;
