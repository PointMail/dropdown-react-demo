import * as React from "react";
import { Paper } from "@material-ui/core";
import PointAPI, { ReplyMeta } from "@point-api/js-sdk";
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
  replySuggestions: ReplyMeta[] | null;
}

/** Component that displays sample replies to some previous message */
class ReplyDemo extends React.Component<ReplyDemoProps, ReplyDemoState> {
  /** An instance of Point API to get suggestions with */
  private api: PointAPI;
  /** Ref to the input field for previous message */
  private contextRef: React.RefObject<HTMLInputElement>;

  constructor(props: ReplyDemoProps) {
    super(props);
    this.state = {
      replySuggestions: null
    };
    this.api = new PointAPI(props.email, props.jwt);
    this.contextRef = React.createRef();
  }

  /** Set the previous message of the Point API session */
  public setContext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!this.contextRef.current) return;
    const response = await this.api.reply(this.contextRef.current.value);

    this.setState({
      replySuggestions: response ? response.replies : null
    });
  };

  public render() {
    const { replySuggestions } = this.state;

    return (
      <div id="editable-wrapper">
        <ContextForm inputRef={this.contextRef} setContext={this.setContext} />
        <Paper className="reply-wrapper">
          {replySuggestions
            ? replySuggestions.map(({ prompt, suggestions }) => (
                <div>
                  <h3>{prompt}</h3>
                  {suggestions.map(({ text: reply }) => (
                    <Paper className="reply-suggestion" key={reply}>
                      {reply}
                    </Paper>
                  ))}
                </div>
              ))
            : "No replies found!"}
        </Paper>
      </div>
    );
  }
}

export default ReplyDemo;
