import * as React from "react";
import { TextField, Button } from "@material-ui/core";


function contextForm({ inputRef, setContext }) {
  return (
    <form>
      <TextField
        id="previous-message-textfield"
        className="text-field"
        type="text"
        placeholder="Previous Message"
        name="previousMessage"
        inputRef={inputRef}
        multiline={true}
        rows={3}
      />
      <Button type="submit" variant="outlined" onClick={setContext}>
        Set
      </Button>
    </form>
  );
}

export default contextForm;
