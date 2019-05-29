import React from "react";
// import { JsonEditor as Editor } from "jsoneditor-react";
import JSONEditor from "jsoneditor";
import Files from "react-files";

import "jsoneditor/dist/jsoneditor.css";

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.editor = null;
    this.editorRef = null;
  }

  componentDidMount() {
    this.editor = new JSONEditor(this.editorRef, {
      mode: "code",
      onChange: this.handleChange
    });
    this.editor.set(this.props.jsonFile);
  }

  componentWillUpdate(nextProps, nextState) {
    console.log("next", nextProps, nextState)
    if (nextProps.jsonFile !== this.props.jsonFile) {
      this.editor.update(nextProps.jsonFile);
    }
  }

  componentWillUnmount() {
    this.editor.destroy();
  }

  handleChange = () => {
    try {
      this.props.changeJson(this.editor.get())
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    return (
      <div className="test">
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

export default Editor;
