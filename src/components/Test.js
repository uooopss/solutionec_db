import React from "react";
// import { JsonEditor as Editor } from "jsoneditor-react";
import JSONEditor from "jsoneditor";
import Files from "react-files";
import { saveAs } from "file-saver";

import "jsoneditor/dist/jsoneditor.css";

class Test extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      jsonFile: ""
    };

    this.editor = null;
    this.editorRef = null;
  }

  componentDidMount() {
    this.editor = new JSONEditor(this.editorRef, {
      mode: "code",
      onChange: this.handleChange
    });
  }

  componentWillUnmount() {
    this.editor.destroy();
  }

  onFilesChange = file => {
    console.log("fils", file);
    this.fileReader = new FileReader();
    this.fileReader.readAsText(file[0]);
    this.fileReader.onload = event => {
      console.log("jsonData", event.target.result);
      this.setState({ jsonFile: JSON.parse(event.target.result) }, () => {
        console.log("json", this.state.jsonFile);
        this.editor.set(this.state.jsonFile);
      });
    };
  };

  onFilesError = (error, file) => {
    console.log("error code " + error.code + ": " + error.message);
  };

  handleChange = () => {
    try {
      this.setState({
        jsonFile: this.editor.get()
      });
    } catch (e) {
      // HACK! This should propagate the error somehow
      console.error(e);
    }
  };

  downloadFile = () => {
    const data = JSON.stringify(this.state.jsonFile);

    var file = new File([data], "new_json_file.json", {
      type: "text/plain;charset=utf-8"
    });
    saveAs(file);
  };

  render() {
    return (
      <div className="test">
        <Files
          className="files-dropzone"
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
          <button> Upload</button>
        </Files>
        <button type="button" onClick={() => this.downloadFile()}>
          Save Changes
        </button>
        <div
          id="editor"
          className="jsoneditor-react-container"
          ref={ref => {
            this.editorRef = ref;
          }}
          style={{ height: 500, width: 1000 }}
        />
      </div>
    );
  }
}

export default Test;

// import React from "react";
// import Files from "react-files";
// import { saveAs } from "file-saver";
// import update from "immutability-helper";

// import "./App.scss";

// class App extends React.Component {
//   state = {
//     jsonfile: ""
//   };

//   onFilesChange = file => {
//     console.log("fils", file);
//     this.fileReader = new FileReader();
//     this.fileReader.readAsText(file[0]);
//     this.fileReader.onload = event => {
//       console.log("jsonData", event.target.result);
//       this.setState({ jsonFile: JSON.parse(event.target.result) }, () => {
//         console.log("json", this.state.jsonFile);
//       });
//     };
//   };

//   onFilesError = (error, file) => {
//     console.log("error code " + error.code + ": " + error.message);
//   };

//   changeTextarea = e => {

//   }

//   changeInput = e => {
//     const { jsonFile } = this.state;
//     const eValue = e.target.value;

//     this.setState({
//       jsonFile: update(jsonFile, {
//         [0]: {
//           quote: {
//             $set: eValue
//           }
//         }
//       })
//     });
//   };

//   downloadFile = () => {
//     const data = JSON.stringify(this.state.jsonFile);

//     var file = new File([data], "new_json_file.json", {
//       type: "text/plain;charset=utf-8"
//     });
//     saveAs(file);
//   };

//   render() {
//     const { jsonFile } = this.state;
//     console.log("App", jsonFile);

//     const temp_quote = jsonFile ? jsonFile[0].quote : "nothing";
//     return (
//       <div className="files">
//         <Files
//           className="files-dropzone"
//           onChange={file => {
//             this.onFilesChange(file);
//           }}
//           onError={this.onFilesError}
//           accepts={[".json"]}
//           multiple
//           maxFiles={3}
//           maxFileSize={10000000}
//           minFileSize={0}
//           clickable
//         >
//           Drop files here or click to upload
//         </Files>

//         <div> jsonFile</div>
//         <div> {jsonFile ? jsonFile[0].quote : ""}</div>
//         <div> {jsonFile ? jsonFile[0].author : ""}</div>

//         <form>
//           <textarea
//             id="description"
//             rows="5"
//             placeholder=""
//             value={jsonFile ? JSON.stringify(jsonFile, null, 2) : ""}
//             onChange={e => this.changeTextarea(e)}
//           />
//           <label> Change quote: </label>
//           <input type="text" name="quote" value={temp_quote} onChange={e => this.changeInput(e)} />
//         </form>

//         <button type="button" onClick={() => this.downloadFile()}>
//           Save Changes
//         </button>
//       </div>
//     );
//   }
// }

// export default App;
