import React, { useState, useEffect } from 'react';
import D3InputGraph from '../D3InputGraph';

const UserPedalInputs = () => {
  const [ currentController, setCurrentController ] = useState(null)
  const [ throttle, setThrottle ] = useState(0)
  const [ brake, setBrake ] = useState(0)
  const [ steering, setSteering ] = useState(0)
  const [ data, setData ] = useState({ throttle: [], brake: [] })

  const scaleInput = (value) => {
    return ((value * -1) + 1) * 50;  // scales and shifts value from range [-1, 1] to [0, 100]
  }

  const checkForControllers = () => {
    let gamepads = navigator.getGamepads();
    for(let i = 0; i < gamepads.length; i++) {
      let gamepad = gamepads[i];
      if(gamepad) {
        setCurrentController(gamepad.id)
        setThrottle(scaleInput(gamepad.axes[2]));
        setBrake(scaleInput(gamepad.axes[5]));
        setSteering(scaleInput(gamepad.axes[0]));
        setData(oldData => {
          const throttleData = [...oldData.throttle, { x: Date.now(), y: scaleInput(gamepad.axes[2]) }];
          const brakeData = [...oldData.brake, { x: Date.now(), y: scaleInput(gamepad.axes[5]) }];
          return { throttle: throttleData.slice(-50), brake: brakeData.slice(-50) }; // Keeps the last 50 data points
        });
      }
    }
  }

  const logController = () => {
    let gamepads = navigator.getGamepads();
    for(let i = 0; i < gamepads.length; i++) {
      let gamepad = gamepads[i];
      if(gamepad) {
        console.log(gamepad)
      }
    }
  }

  // Set up an interval to continuously check for controller updates
  useEffect(() => {
    const intervalId = setInterval(checkForControllers, 100); // Polling every 1000ms
    return () => clearInterval(intervalId); // Clear the interval when the component unmounts
  }, []);

  return (
    <div>
      <button onClick={checkForControllers}>refresh controllers</button>
      <button onClick={logController}>log controller</button>
      <div>Your Inputs ({currentController}):</div>
      <div>brake: {brake.toFixed(2)}%</div>
      <div>throttle: {throttle.toFixed(2)}%</div>
      <div>steering: {steering.toFixed(2)}%</div>
      {data.throttle.length > 0 && data.brake.length > 0 && (
        <D3InputGraph datasets={[data.throttle, data.brake]} />
      )}
    </div>
  )
}

export default UserPedalInputs
