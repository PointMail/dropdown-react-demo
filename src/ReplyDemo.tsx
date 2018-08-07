import * as React from "react";
import { Paper } from "@material-ui/core";
import PointAPI, { SuggestionMeta } from "@point-api/js-sdk";
import ContextForm from "./ContextForm";
/** Props to pass to a ReplyDemo */
interface ReplyDemoProps {
  /** Demo user's email address */
  email: string;
  /** Demo user's auth token recieved from `/auth` endpoint */
  jwt: string;
}

/** State of an ReplyDemo */
interface ReplyDemoState {
  suggestions: SuggestionMeta[] | null;
}

/** Component that displays sample replies to some past context */
class ReplyDemo extends React.Component<ReplyDemoProps, ReplyDemoState> {
  /** An instance of Point API to get suggestions with */
  private api: PointAPI;
  /** Ref to the input field for past context */
  private contextRef: React.RefObject<HTMLInputElement>;

  constructor(props: ReplyDemoProps) {
    super(props);
    this.state = {
      suggestions: null
    };
    this.api = new PointAPI(props.email, props.jwt);
    this.contextRef = React.createRef();
  }

  /** Set the past context of the Point API session */
  public setContext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!this.contextRef.current) return;
    await this.api.setContext(this.contextRef.current.value, "text");
    this.setState({
      suggestions: await this.api.searchSuggestions("")
    });
  };

  public render() {
    const { suggestions } = this.state;

    return (
      <div id="editable-wrapper">
        <div style={{ marginTop: 30 }}>{this.props.email}</div>
        <Paper className="reply-wrapper">
          {suggestions
            ? suggestions.map(({ suggestion }) => (
                <Paper className="reply-suggestion" key={suggestion}>
                  {suggestion}
                </Paper>
              ))
            : "Type some context!"}
        </Paper>
        <ContextForm inputRef={this.contextRef} setContext={this.setContext} />
      </div>
    );
  }
}

export default ReplyDemo;
