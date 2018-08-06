import * as React from "react";
import { Switch, FormControlLabel } from "@material-ui/core";
import addDropdown, { AutoCompleteInstance } from "@point-api/dropdown-react";
import ContextForm from "./ContextForm";

/**
 *  Creates a react component that simply wraps a content editable div
 *  @returns A react component wrapping a content editable
 */
function contentEditable() {
  return (
    <div
      contentEditable={true}
      suppressContentEditableWarning={true}
      id="content-editable"
    />
  );
}

/** Props to pass to an EditableDemo */
interface EditableDemoProps {
  /** Demo user's email address */
  email: string;

  /** Demo user's auth token recieved from `/auth` endpoint */
  jwt: string;
}

/** State of an EditableDemo */
interface EditableDemoState {
  /** The Autocomplete component to render. Held in state to allow for settings toggles. */
  Component: ReturnType<typeof addDropdown>;
}

/** Component that contains the a ContentEditable demo and its settings toggles */
class EditableDemo extends React.Component<
  EditableDemoProps,
  EditableDemoState
> {
  /** Ref to the Autocomplete instance created by addDropdown */
  private editableRef: React.RefObject<AutoCompleteInstance>;

  /** Ref to the input field for past context */
  private contextRef: React.RefObject<HTMLInputElement>;

  constructor(props: EditableDemoProps) {
    super(props);
    this.state = {
      Component: addDropdown(contentEditable, props.email, props.jwt)
    };
    this.editableRef = React.createRef();
    this.contextRef = React.createRef();
  }

  /** Set the past context of the Point API session */
  public setContext = async () => {
    if (!this.editableRef.current || !this.contextRef.current) return;
    await this.editableRef.current.setContext(
      this.contextRef.current.value,
      "text"
    );
  };

  /**
   * Toggle the keyword searching mode of the Point API session
   * @param e - The Input change event with the checkbox state
   */
  public toggleKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      Component: addDropdown(
        contentEditable,
        this.props.email,
        this.props.jwt,
        { keywordSearch: e.target.checked }
      )
    });
  };

  public render() {
    return (
      <div id="editable-wrapper">
        <div style={{ marginTop: 30 }}>{this.props.email}</div>
        <this.state.Component ref={this.editableRef} />
        <ContextForm inputRef={this.contextRef} setContext={this.setContext} />
        <FormControlLabel
          control={
            <Switch
              onChange={this.toggleKeyword}
              value="keyword"
              name="keyword"
              id="keyword"
            />
          }
          label="Keyword Search"
        />
      </div>
    );
  }
}

export default EditableDemo;
