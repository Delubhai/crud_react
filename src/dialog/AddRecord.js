import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { v4 as uuidv4 } from 'uuid';


const MAX_FILE_SIZE = 5 * 1024 * 1024; //5MB

const validFileExtensions = { image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'] };

function isValidFileType(fileName, fileType) {
  return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
}
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  startDate: yup.date().typeError('Date is required').required("Date is required").min(new Date(), 'Date must be later'),
  endDate: yup.date().typeError('Date is required').required("Date is required").min(new Date(), 'Date must be later'),
  status: yup.number().min(1, 'Select status').required(),
  image: yup
    .mixed()
    .required("Required")
    .test("is-valid-type", "Not a valid image type",
      value => isValidFileType(value && value?.[0]?.name?.toLowerCase(), "image"))
    .test("is-valid-size", "Max allowed size is 5MB",
      value => value && value?.[0]?.size <= MAX_FILE_SIZE)
}).required();

export default function AddRecord({ openDialog, closeDialog }) {
  const [open, setOpen] = useState(openDialog);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    let arr = []

    data.image = await imageToBase64(data.image[0])
    const uniqueId = uuidv4();
    data.id = uniqueId;

    const previousItems = JSON.parse(localStorage.getItem('todoList'))
    if (previousItems) arr = previousItems;
    arr.push(data)
    localStorage.setItem('todoList', JSON.stringify(arr))
    handleClose("")
    // console.log(data)
  };

  const handleClose = (values) => {
    setOpen(false);
    closeDialog(values);
    console.log(errors, '>>>errors')
    console.log(watch, '>>>watch')
  };

  function imageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Add TODO</DialogTitle>
        <DialogContent>
          <TextField
            {...register("name")}
            size='small'
            autoFocus margin='dense' id="name" placeholder='todo one' label="Name" type="text"
            fullWidth variant="outlined"
          />
          <p style={{ color: "red", marginTop: 0 }}>{errors.name?.message}</p>
          <TextField
            {...register("startDate")}
            autoFocus
            size='small'
            defaultValue={new Date()}
            InputLabelProps={{ shrink: true }}
            margin="dense" id="startDate" label="Start Date" type="date" fullWidth variant="outlined" />
          <p style={{ color: "red", marginTop: 0 }}>{errors.startDate?.message}</p>
          <TextField
            {...register("endDate")}
            defaultValue={new Date()}
            autoFocus
            size='small'
            InputLabelProps={{ shrink: true }}
            margin="dense" id="endDate" label="End Date" type="date" fullWidth variant="outlined" />
          <p style={{ color: "red", marginTop: 0 }}>{errors.endDate?.message}</p>
          <TextField
            select autoFocus margin="dense"
            size='small'
            defaultValue={0}
            fullWidth
            label="Status"
            {...register("status")}
          // onChange={handleChange}
          >
            <MenuItem value={0} selected disabled>--- Select Status ---</MenuItem>
            <MenuItem value={1}>Active</MenuItem>
            <MenuItem value={2}>Inactive</MenuItem>
          </TextField>
          <p style={{ color: "red", marginTop: 0 }}>{errors.status?.message}</p>

          <TextField
            autoFocus
            {...register('image')}
            size='small'
            InputLabelProps={{ shrink: true }} margin="dense" label="Select Image" type="file" fullWidth variant="outlined"></TextField>
          <p style={{ color: "red", marginTop: 0 }}>{errors.image?.message}</p>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => { handleClose("cancel") }}>Cancel</Button>
          <Button type='submit'>Submit</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
