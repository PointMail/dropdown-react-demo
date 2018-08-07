import * as React from "react";
import "./App.css";
import logo from "./assets/point-logo.svg";
import { createMuiTheme } from "@material-ui/core/styles";
import EditableDemo from "./EditableDemo";
import ReplyDemo from "./ReplyDemo";
import {
  MuiThemeProvider,
  TextField,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel
} from "@material-ui/core";

const theme = createMuiTheme({
  typography: {
    fontFamily: "Avenir Next"
  }
});

const DemoTypes = {
  editable: EditableDemo,
  reply: ReplyDemo
};

/** The metadata needed to create a demo component */
interface Demo {
  email: string;
  jwt: string;
  type: string;
}
interface AppState {
  /** A list of open Point API demos */
  demos: Demo[];
  /** What kind of demo a new one will be */
  newDemoType: string;
}

class App extends React.Component<{}, AppState> {
  /** Ref to email input element */
  private emailInput: React.RefObject<HTMLInputElement>;
  /** Ref to apiKey input element */
  private apiKeyInput: React.RefObject<HTMLInputElement>;
  constructor(props: {}) {
    super(props);
    this.emailInput = React.createRef();
    this.apiKeyInput = React.createRef();
    this.state = { demos: [], newDemoType: "reply" };
  }

  /**
   * Retrieve a JWT from the `/auth` endpoint
   * @param emailAddress - the email address of the user to retrieve the token for
   * @param apiKey - your api key
   * @returns the jwt or null if the credentials were bad
   */
  public async getJwt(
    emailAddress: string,
    apiKey: string
  ): Promise<string | null> {
    if (!emailAddress || !apiKey) {
      alert("Please add credentials! 😒");
      return null;
    }
    const resp = await fetch(
      `https://v1.pointapi.com/auth?emailAddress=${emailAddress}`,
      {
        headers: {
          Authorization: "Bearer " + apiKey
        },
        method: "POST"
      }
    );
    try {
      return (await resp.json()).jwt;
    } catch {
      alert("Bad Credentials 🤦‍");
      return null;
    }
  }

  /** Create and render a new Point API demo */
  public addDemo = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!this.emailInput.current || !this.apiKeyInput.current) return;
    const jwt = await this.getJwt(
      this.emailInput.current.value,
      this.apiKeyInput.current.value
    );
    if (!jwt) return;
    this.setState({
      demos: this.state.demos.concat({
        email: this.emailInput.current.value,
        jwt,
        type: this.state.newDemoType
      })
    });
  };
  public handleChange = event => {
    this.setState({ newDemoType: event.target.value });
  };

  public render() {
    return [
      <header key="header">
        <div id="header-logo">
          <a href="/">
            <img src={logo} />
          </a>
        </div>
        <h1>Dropdown Demo</h1>
      </header>,
      <MuiThemeProvider key="App" theme={theme}>
        <div className="App">
          <form id="create-editable">
            <TextField
              className="text-field"
              inputRef={this.emailInput}
              placeholder="Email"
            />
            <TextField
              className="text-field"
              inputRef={this.apiKeyInput}
              placeholder="ApiKey"
            />
            <RadioGroup
              name="demoType"
              value={this.state.newDemoType}
              onChange={this.handleChange}
              row={true}
              id="demo-radios"
            >
              <FormControlLabel
                value="reply"
                control={<Radio />}
                label="Reply"
              />
              <FormControlLabel
                value="editable"
                control={<Radio />}
                label="Editable"
              />
            </RadioGroup>
            <Button type="submit" variant="outlined" onClick={this.addDemo}>
              Create Demo
            </Button>
          </form>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto",
              textAlign: "center"
            }}
          >
            {this.state.demos.map(({ email, jwt, type }) => {
              const NewDemo = DemoTypes[type];
              return (
                <NewDemo key={`${email}_${type}`} email={email} jwt={jwt} />
              );
            })}
          </div>
        </div>
      </MuiThemeProvider>
    ];
  }
}

export default App;
