import React from "react";

import Editor from "../Editor";
import Header from "../Header";

import "./App.scss";

class App extends React.Component {
  state = {
    jsonFile: "",
    new_jsonFile: "",
    errors: false
  };

  setJson = json => {
    this.setState({ jsonFile: json, new_jsonFile: json });
  };

  setErrors = err => {
    this.setState({
      errors: err
    });
  };

  handleChangeNewJson(json, err) {
    this.setState({
      new_jsonFile: json,
      errors: err
    });
  }

  render() {
    const { jsonFile, new_jsonFile, errors } = this.state;
    return (
      <div className="container-fluid p-0">
        <div className="row m-0 json_editor">
          <div className="col col-12 p-0 d-flex" style={{ flexDirection: "column" }}>
            <Header jsonFile={new_jsonFile} setJson={this.setJson} errors={errors} />
            <div className="uk-container uk-container-large uk-margin-remove uk-padding-small main-content">
              <Editor jsonFile={jsonFile} changeJson={this.handleChangeNewJson.bind(this)} setErrors={this.setErrors} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
