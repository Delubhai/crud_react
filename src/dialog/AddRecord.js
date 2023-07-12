import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { apiBaseUrl } from '../constants/globalConstant';
import { toast } from 'react-toastify';
import moment from 'moment';


const MAX_FILE_SIZE = 5 * 1024 * 1024; //5MB

const validFileExtensions = { image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'] };

function isValidFileType(fileName, fileType) {
  return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
}
const schema = yup.object().shape({
  // name: yup.string().required("Name is required"),
  vTitle: yup.string().required("Name is required"),
  vDescription: yup.string().required("Name is required"),
  // startDate: yup.date().typeError('Date is required').required("Date is required").min(new Date(), 'Date must be later'),
  iDueDate: yup.date().typeError('Date is required').required("Date is required").min(new Date(), 'Date must be later'),
  // status: yup.number().min(1, 'Select status').required(),
  // image: yup
  //   .mixed()
  //   .required("Required")
  //   .test("is-valid-type", "Not a valid image type",
  //     value => isValidFileType(value && value?.[0]?.name?.toLowerCase(), "image"))
  //   .test("is-valid-size", "Max allowed size is 5MB",
  //     value => value && value?.[0]?.size <= MAX_FILE_SIZE)
}).required();

export default function AddRecord({ editId, openDialog, closeDialog }) {
  const [open, setOpen] = useState(openDialog);
  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (editId) {
      getTaskById()
    }
  }, []);

  const getTaskById = async () => {
    let response = await axios.get(`${apiBaseUrl}/todo/${editId}`, { headers: { 'access_key': localStorage.getItem('vAccessToken') } })
    console.log(response, 'response get task by id')
    const dueDate = new Date(response.data.data.iDueDate * 1000).toISOString().substr(0, 10);
    setValue('vTitle', response.data.data.vTitle)
    setValue('vDescription', response.data.data.vDescription)
    setValue('iDueDate', dueDate)
  }
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

  const onSubmitApi = async (data) => {
    console.log(data, '>>>>>>')
    let response
    if (editId) {
      response = await axios.put(`${apiBaseUrl}/todo/${editId}`, data, { headers: { 'access_key': localStorage.getItem('vAccessToken') } })
    } else {
      response = await axios.post(`${apiBaseUrl}/todo`, data, { headers: { 'access_key': localStorage.getItem('vAccessToken') } });
    }
    if (response.data.code === 200) {
      toast.success(response.data.message)
      handleClose("")
    } else {
      toast.error(response.data.message)
    }

  }

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
      <form onSubmit={handleSubmit(onSubmitApi)}>
        <DialogTitle>{editId ? 'Update' : 'Add'} Task</DialogTitle>
        <DialogContent>
          <TextField
            {...register("vTitle")}
            size='small'
            autoFocus margin='dense' id="vTitle" placeholder='Todo one' type="text"
            fullWidth variant="outlined"
          />
          <p style={{ color: "red", marginTop: 0 }}>{errors.name?.message}</p>
          <TextField
            {...register("vDescription")}
            size='small'
            autoFocus margin='dense' id="vDescription" placeholder='Description one' type="text"
            fullWidth variant="outlined"
          />
          <p style={{ color: "red", marginTop: 0 }}>{errors.name?.message}</p>
          {/* <TextField
            {...register("startDate")}
            autoFocus
            size='small'
            defaultValue={new Date()}
            InputLabelProps={{ shrink: true }}
            margin="dense" id="startDate" label="Start Date" type="date" fullWidth variant="outlined" />
          <p style={{ color: "red", marginTop: 0 }}>{errors.startDate?.message}</p> */}
          <TextField
            {...register("iDueDate")}
            defaultValue={new Date()}
            autoFocus
            size='small'
            InputLabelProps={{ shrink: true }}
            margin="dense" id="iDueDate" label="Due Date" type="date" fullWidth variant="outlined" />
          <p style={{ color: "red", marginTop: 0 }}>{errors.iDueDate?.message}</p>
          {/* <TextField
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
          </TextField> */}
          <p style={{ color: "red", marginTop: 0 }}>{errors.status?.message}</p>

          {/* <TextField
            autoFocus
            {...register('image')}
            size='small'
            InputLabelProps={{ shrink: true }} margin="dense" label="Select Image" type="file" fullWidth variant="outlined"></TextField>
          <p style={{ color: "red", marginTop: 0 }}>{errors.image?.message}</p> */}

        </DialogContent>
        <DialogActions>
          <Button onClick={() => { handleClose("cancel") }}>Cancel</Button>
          <Button type='submit'>Submit</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
