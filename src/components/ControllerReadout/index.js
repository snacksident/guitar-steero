import React, { useState, useEffect } from 'react';
import InputGraph from '../InputGraph';

const ControllerReadout = () => {
  const [gamepadData, setGamepadData] = useState(null);
  const [mapping, setMapping] = useState({
    brake: null,
    throttle: null,
    steering: null,
  });
  const [calibration, setCalibration] = useState({
    brake: { min: Infinity, max: -Infinity },
    throttle: { min: Infinity, max: -Infinity },
    steering: { min: Infinity, max: -Infinity },
  });

  const updateGamepadData = () => {
    const gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        setGamepadData(gamepads[i]);
      }
    }
  };

  const setAxis = (axis, event) => {
    setMapping({
      ...mapping,
      [axis]: parseInt(event.target.value),
    });
  };

  const calibrate = (axis, minOrMax) => {
    const value = gamepadData.axes[mapping[axis]];
    setCalibration({
      ...calibration,
      [axis]: { ...calibration[axis], [minOrMax]: value },
    });
  };

  useEffect(() => {
    const intervalId = setInterval(updateGamepadData, 100);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h2>Controller Readout</h2>
      {gamepadData ? (
        <>
          <h3>Axes:</h3>
          {gamepadData.axes.map((value, index) => (
            <div key={index}>
              Axis {index}: {value.toFixed(2)}
              <button value={index} onClick={(e) => setAxis('brake', e)}>
                Set as Brake
              </button>
              <button value={index} onClick={(e) => setAxis('throttle', e)}>
                Set as Throttle
              </button>
              <button value={index} onClick={(e) => setAxis('steering', e)}>
                Set as Steering
              </button>
            </div>
          ))}
          <h3>Buttons:</h3>
          {gamepadData.buttons.map((button, index) => (
            <div key={index}>
              Button {index}: {button.pressed ? 'Pressed' : 'Not Pressed'}
            </div>
          ))}
          <h3>Mapping and Calibration:</h3>
          {['brake', 'throttle', 'steering'].map((axis) => (
            <div key={axis}>
              {axis[0].toUpperCase() + axis.slice(1)} Axis: {mapping[axis]}
              <button onClick={() => calibrate(axis, 'min')}>Calibrate Min</button>
              <button onClick={() => calibrate(axis, 'max')}>Calibrate Max</button>
              <p>
                Min: {calibration[axis].min.toFixed(2)}, Max:{' '}
                {calibration[axis].max.toFixed(2)}
              </p>
            </div>
          ))}
        </>
      ) : (
        <p>No gamepad connected.</p>
      )}
        {gamepadData ? (
            <InputGraph
            steering={gamepadData.axes[mapping.steering]}
            throttle={gamepadData.axes[mapping.throttle]}
            brake={gamepadData.axes[mapping.brake]}
            />
        ) : (
            <p>No controller selected or controller has been disconnected.</p>
        )}
    </div>
  );
};

export default ControllerReadout;
