import React from "react";
import Files from "react-files";
import { saveAs } from "file-saver";
import * as UIkit from "uikit";

import ModalUrl from "./ModalUrl";

import "./App/App.scss";

const data_to_navigator = [
  {
    name: "New",
    type: "button",
    values: []
  },
  {
    name: "Open",
    type: "dropdown",
    values: [
      {
        name: "Open from disk",
        type: "open_disk"
      },
      {
        name: "Open url",
        type: "open_url"
      }
    ]
  },
  {
    name: "Save",
    type: "dropdown",
    values: [
      // {
      //   name: "Save online",
      //   type: "save_online"
      // },
      {
        name: "Save to disk",
        type: "save_disk"
      },
      {
        name: "Save to url",
        type: "save_url"
      }
    ]
  },
  {
    name: "Settings",
    type: "button"
  },
  {
    name: "Help",
    type: "button"
  }
];

class Header extends React.Component {
  renderDropOptions = d => {
    let content = "";

    switch (true) {
      case d.type === "open_disk":
        content = (
          <Files
            onChange={file => {
              this.onFilesChange(file);
            }}
            onError={this.onFilesError}
            accepts={[".json"]}
            multiple
            maxFiles={3}
            maxFileSize={10000000}
            minFileSize={0}
            clickable
          >
            <span> {d.name}</span>
          </Files>
        );
        break;
      case d.type === "open_url":
        content = (
          <div>
            <span data-uk-toggle={"target: #open_url"}>{d.name}</span>
            <ModalUrl id={"open_url"} setJson={this.props.setJson} />
          </div>
        );
        break;
      case d.type === "save_online":
        content = <span> {d.name}</span>;
        break;
      case d.type === "save_disk":
        content = <span onClick={() => this.saveJsonToDisk()}> {d.name}</span>;
        break;
      case d.type === "save_url":
        content = (
          <div>
            {!this.props.errors ? (
              <span data-uk-toggle={"target: #save_url"}>{d.name}</span>
            ) : (
              <span onClick={() => this.errorsNotification()}>{d.name}</span>
            )}
            <ModalUrl id={"save_url"} />
          </div>
        );
        break;
      default:
        break;
    }
    return content;
  };

  onFilesChange = file => {
    this.fileReader = new FileReader();
    this.fileReader.readAsText(file[0]);
    this.fileReader.onload = event => {
      this.props.setJson(JSON.parse(event.target.result));
    };
  };

  onFilesError = (error, file) => {
    console.log("error code " + error.code + ": " + error.message);
  };

  saveJsonToDisk = () => {
    const { errors } = this.props;

    if (!errors) {
      const data = JSON.stringify(this.props.jsonFile);
      var file = new File([data], "new_json_file.json", {
        type: "text/plain;charset=utf-8"
      });
      saveAs(file);
    } else {
      this.errorsNotification();
    }
  };

  errorsNotification = () => {
    UIkit.notification.closeAll();
    UIkit.notification({ message: "Bad JSON", status: "danger", timeout: 1500 });
  };

  render() {
    return (
      <nav className="uk-navbar-container uk-margin-remove " data-uk-navbar>
        <div className="uk-navbar-left">
          <a className="uk-navbar-item uk-logo" href="#">
            Logo
          </a>
        </div>
        <div className="uk-navbar-center">
          <ul className="uk-navbar-nav">
            {data_to_navigator.map((d, i) => (
              <li key={i}>
                <a href="">{d.name}</a>
                {d.type === "dropdown" ? (
                  <div className="uk-navbar-dropdown uk-width-small" data-uk-drop="offset: 0; mode: click">
                    <ul className="uk-nav uk-navbar-dropdown-nav">
                      {d.values.map((dd, ii) => (
                        <li key={ii}>{this.renderDropOptions(dd)}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }
}

export default Header;
