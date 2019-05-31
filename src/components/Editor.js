import React from "react";
import JSONEditor from "jsoneditor";
import * as UIkit from "uikit";

import "jsoneditor/dist/jsoneditor.css";

class Editor extends React.Component {
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
      onChange: this.handleChange.bind(this)
    });
    this.editor.set(this.state.jsonFile);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.jsonFile !== this.props.jsonFile) {
      this.setState(
        {
          jsonFile: nextProps.jsonFile
        },
        () => this.editor.update(nextProps.jsonFile)
      );
    }
  }

  componentWillUnmount() {
    this.editor.destroy();
  }

  handleChange() {
    UIkit.notification.closeAll();
    try {
      this.props.changeJson(this.editor.get(), false);
      this.setState({
        jsonFile: this.editor.get()
      });
    } catch (e) {
      this.props.setErrors(true);
    }
  }

  render() {
    return (
      <div
        id="editor"
        className="jsoneditor-react-container"
        ref={ref => {
          this.editorRef = ref;
        }}
        style={{ height: 500, width: "50%" }}
      />
    );
  }
}

export default Editor;
