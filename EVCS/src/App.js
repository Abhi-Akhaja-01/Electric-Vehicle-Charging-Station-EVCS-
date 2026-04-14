import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import MainRoute from "./routes";
import "react-toastify/dist/ReactToastify.css";
import "../src/assets/styles/app.scss";
import "react-datepicker/dist/react-datepicker.css";
import './firebase';

function App() { 
  return (
    <div className="App">
      <div className="container">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <BrowserRouter>
          <MainRoute />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
