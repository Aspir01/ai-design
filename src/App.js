import ChatWindow from "./components/ChatWindow";
import Inputs from "./components/Inputs";

function App() {
  return (
    <div className="App">
      <div className="left-block">
        <div>
          <img src="logo.png" alt="лого" />
          <p>Designer Chat</p>
        </div>
      </div>
      <main>
        <ChatWindow />
        <Inputs />
      </main>
    </div>
  );
}

export default App;
