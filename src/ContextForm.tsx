import * as React from "react";
import { TextField, Button } from "@material-ui/core";

function contextForm({ inputRef, setContext }) {
  return (
    <div>
      <TextField
        className="text-field"
        type="text"
        placeholder="Past Context"
        name="pastContext"
        inputRef={inputRef}
        multiline={true}
      />
      <Button variant="outlined" onClick={setContext}>
        Set
      </Button>
    </div>
  );
}

export default contextForm;
