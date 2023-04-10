import "./App.css";
import MainPageComponent from "./main";
import { Switch, Route } from "react-router-dom";
import { HeartOutlined } from "@ant-design/icons";

function App() {
  return (
    <div>
      <div id="header">
        <div id="header-area">
          <HeartOutlined style={{ marginRight: "8px" }} />
          <span>Haiku Maker</span>
        </div>
      </div>
      <div id="body">
        <Switch>
          <Route path={"/"}>
            <MainPageComponent />
          </Route>
        </Switch>
      </div>
      <div id="footer">
        <p>Copyright © 2023 Dahye</p>
        <p>
          <a href="#">About</a> -<a href="#">Privacy Policy</a> -
          <a href="#">Contact Us</a>
        </p>
      </div>
    </div>
  );
}

export default App;
