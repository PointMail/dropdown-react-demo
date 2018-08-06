import * as React from "react";
import "./App.css";
import logo from "./assets/point-logo.svg";
import { createMuiTheme } from "@material-ui/core/styles";
import EditableDemo from "./EditableDemo";
import { MuiThemeProvider, TextField, Button } from "@material-ui/core";

const theme = createMuiTheme({
  typography: {
    fontFamily: "Avenir Next"
  }
});

/** The metadata needed to create a demo component */
interface Demo {
  email: string;
  jwt: string;
}

class App extends React.Component<
  {},
  {
    /** A list of open Point API demos */
    demos: Demo[];
  }
> {
  /** Ref to email input element */
  private emailInput: React.RefObject<HTMLInputElement>;
  /** Ref to apiKey input element */
  private apiKeyInput: React.RefObject<HTMLInputElement>;
  constructor(props: {}) {
    super(props);
    this.emailInput = React.createRef();
    this.apiKeyInput = React.createRef();
    this.state = { demos: [] };
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
  public addDemo = async () => {
    if (!this.emailInput.current || !this.apiKeyInput.current) return;
    const jwt = await this.getJwt(
      this.emailInput.current.value,
      this.apiKeyInput.current.value
    );
    if (!jwt) return;
    this.setState({
      demos: this.state.demos.concat({
        email: this.emailInput.current.value,
        jwt
      })
    });
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
          <Button variant="outlined" onClick={this.addDemo}>
            Create Editable
          </Button>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto",
              textAlign: "center"
            }}
          >
            {this.state.demos.map(({ email, jwt }) => (
              <EditableDemo email={email} jwt={jwt} />
            ))}
          </div>
        </div>
      </MuiThemeProvider>
    ];
  }
}

export default App;
