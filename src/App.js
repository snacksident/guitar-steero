import UserPedalInputs from './components/UserPedalInputs';
import ControllerConfig from './components/ControllerConfig';
import ControllerReadout from './components/ControllerReadout';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Guitar Steero</h1>
      </header>
      <section>
        {/* <UserPedalInputs /> */}
        <ControllerConfig />
        <ControllerReadout />
      </section>
    </div>
  );
}

export default App;
