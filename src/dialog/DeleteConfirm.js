import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React, { useState } from 'react'

function DeleteConfirm({ message, openDialog, closeDialog }) {
  const [open, setOpen] = useState(openDialog);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = (value) => {
    setOpen(false);
    closeDialog(value)
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Confirm"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)}>Disagree</Button>
        <Button onClick={() => handleClose(true)} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirm