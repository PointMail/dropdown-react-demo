import * as React from "react";
import { TextField, Button } from "@material-ui/core";


function contextForm({ inputRef, setContext }) {
  return (
    <form>
      <TextField
        className="text-field"
        type="text"
        placeholder="Past Context"
        name="pastContext"
        inputRef={inputRef}
        multiline={true}
      />
      <Button type="submit" variant="outlined" onClick={setContext}>
        Set
      </Button>
    </form>
  );
}

export default contextForm;
