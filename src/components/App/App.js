import React from "react";
import Files from "react-files";
import { saveAs } from "file-saver";

import Editor from "../Editor";

import "./App.scss";

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
      {
        name: "Save online",
        type: "save_online"
      },
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

class App extends React.Component {
  state = {
    jsonFile: ""
  };

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
        content = <span> {d.name}</span>;
        break;
      case d.type === "save_online":
        content = <span> {d.name}</span>;
        break;
      case d.type === "save_disk":
        content = <span onClick={() => this.saveJsonToDisk()}> {d.name}</span>;
        break;
      case d.type === "save_url":
        content = <span> {d.name}</span>;
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
      this.setState({ jsonFile: JSON.parse(event.target.result) });
    };
  };

  onFilesError = (error, file) => {
    console.log("error code " + error.code + ": " + error.message);
  };

  handleChangeJson = json => {
    this.setState({
      jsonFile: json
    });
  };

  saveJsonToDisk = () => {
    const data = JSON.stringify(this.state.jsonFile);

    var file = new File([data], "new_json_file.json", {
      type: "text/plain;charset=utf-8"
    });
    saveAs(file);
  };

  render() {
    const { jsonFile } = this.state;
    return (
      <div className="container-fluid p-0">
        <div className="row m-0 json_editor">
          <div className="col col-12 p-0 d-flex" style={{ flexDirection: "column" }}>
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
            <div className="uk-container uk-container-large uk-margin-remove uk-padding-small main-content">
              <Editor jsonFile={jsonFile} changeJson={this.handleChangeJson} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
