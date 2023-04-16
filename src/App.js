import "./App.css";
import MainPageComponent from "./main";
import AdminPageComponent from "./admin";
import { Switch, Route } from "react-router-dom";
import { HeartOutlined } from "@ant-design/icons";

function App() {
  const handleClick = () => {
    window.location.href = "/";
  };
  return (
    <div>
      <div id="header">
        <div id="header-area" onClick={handleClick}>
          <HeartOutlined style={{ marginRight: "8px" }} />
          <span>Haiku Maker</span>
        </div>
      </div>
      <div id="body">
        <Switch>
          <Route path={"/"} exact>
            <MainPageComponent />
          </Route>
          <Route path={"/admin"}>
            <AdminPageComponent />
          </Route>
        </Switch>
      </div>
      <div id="footer">
        <p>Copyright © 2023 Dahye</p>
        <p>
          <a href="/admin">Go to admin page</a> 
        </p>
      </div>
    </div>
  );
}

export default App;
