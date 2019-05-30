import React from "react";
import { Formik, Form, Field } from "formik";
import * as UIkit from "uikit";

import "./ModalUrl.scss";
import "jsoneditor/dist/jsoneditor.css";

const modal_content = {
  open_url: {
    header: "Open url",
    main: (
      <div>
        <p className="uk-text-muted"> {"Enter a public url. "}</p>
        <p className="uk-text-muted">
          {"Urls which need authentication or do not have CORS enabled cannot be loaded."}
        </p>
      </div>
    )
  },
  save_url: {
    header: "Save to url",
    main: (
      <div>
        <p className="uk-text-muted"> {"Enter a public url of a server. "}</p>
        <p className="uk-text-muted">
          {
            "When clicking Save, an HTTP POST request will be send to the selected url with the JSON document as body. The url must not require authentication and must have CORS enabled."
          }
        </p>
      </div>
    )
  }
};

const validateUrl = value => {
  let errors = "";
  if (value.length < 1) {
    errors = "Invalid url";
  }

  return errors;
};

class ModalUrl extends React.Component {
  constructor(props) {
    super(props);

    this.formik = React.createRef();
  }

  componentDidMount() {
    document.addEventListener("keydown", this.resetFormESC, false);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.resetFormESC, false);
  }

  resetInputsValue = () => {
    this.formik.current.setSubmitting(false);
    this.formik.current.resetForm();
  };

  resetFormESC = event => {
    if (event.keyCode === 27) {
      this.formik.current.setSubmitting(false);
      this.formik.current.resetForm();
    }
  };

  handleSubmit = (values, setSubmitting) => {
    const { id } = this.props;
    this.getFileByUrl(values.url);

    setSubmitting(false);
    this.formik.current.resetForm();
    UIkit.modal("#" + id).hide();
  };

  getFileByUrl = async url => {
    const response = await fetch(`http://localhost:3000/${url}`, { headers: { "Content-Type": "application/json" } })
      .then(response => {
      console.log("response", response);
      return response.json();
    })
      // .then(res => res.text())  
      // .then(text => console.log("TEXT",text)) 

    // const json = await response.json();
    // console.log("AWAIT JSON", json);
  };

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { id } = this.props;
    console.log("ModalUrl", id);

    return (
      <div id={id} data-uk-modal>
        <div className="uk-modal-dialog">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
            onClick={() => this.resetInputsValue()}
          />
          <div className="uk-modal-header">
            <h2 className="uk-modal-title uk-text-lead">{modal_content[id].header}</h2>
          </div>
          <div className="uk-modal-body">
            {modal_content[id].main}
            <Formik
              ref={this.formik}
              initialValues={{ url: "" }}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                this.handleSubmit(values, setSubmitting);
              }}
            >
              {props => {
                const { touched, errors, isSubmitting, handleSubmit } = props;

                return (
                  <Form className="edit-formik" onSubmit={handleSubmit}>
                    <div className="input-container" style={{ marginBottom: "10px" }}>
                      <Field
                        type="text"
                        name="url"
                        placeholder=""
                        disabled={isSubmitting}
                        validate={validateUrl}
                        onSubmit={handleSubmit}
                        className={errors.url && touched.url ? "text-input error" : "text-input"}
                      />
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
          <div className="uk-modal-footer uk-text-right">
            <button
              className="uk-button uk-button-default uk-modal-close"
              type="button"
              onClick={() => this.resetInputsValue()}
            >
              Cancel
            </button>
            <button
              className="uk-button uk-button-primary"
              type="button"
              onClick={() => {
                this.formik.current.submitForm();
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ModalUrl;
