import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { Button, Chip } from '@mui/material';
import AddRecord from '../dialog/AddRecord';
import DeleteConfirm from '../dialog/DeleteConfirm';
import axios from 'axios';
import { apiBaseUrl } from '../constants/globalConstant';
import moment from 'moment/moment';
import { toast } from 'react-toastify';

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [todoList, setTodoList] = useState([]);;
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [editId, setEditId] = useState('');
  const [markCompleteId, setMarkCompleteId] = useState();
  const [isMarkCompleted, setIsMarkCompleted] = useState(false);

  useEffect(() => {
    getTodoList()
  }, [])

  const handleAddRecord = () => {
    setIsFormOpen(true)
  }
  const handleEdit = (rowData) => {
    console.log(rowData.row._id)
    setEditId(rowData.row._id)
    setIsFormOpen(true)

  }
  const handleDelete = (rowData) => {
    console.log(rowData, ">>>>>>>delete row data")
    setDeleteId(rowData.row._id)
    setIsDeleteOpen(true)
  }
  const handleCloseDeleteConfirm = async (value) => {
    if (value === true) {
      let response = await axios.delete(`${apiBaseUrl}/todo/${deleteId}`, { headers: { 'access_key': localStorage.getItem('vAccessToken') } })
      if (response.data.code === 200) {
        toast.success(response.data.message)
        getTodoList()
      }
      console.log(response, '>>>>>>delete response')
    }
    setIsDeleteOpen(false)
    setDeleteId('')
  }
  const handleCloseCompletedConfirm = async (value) => {
    if (value === true) {
      console.log(`${apiBaseUrl}/todo/${markCompleteId}`)
      console.log(localStorage.getItem('vAccessToken'))
      let response = await axios.patch(`${apiBaseUrl}/todo/${markCompleteId}`, {}, { headers: { 'access_key': localStorage.getItem('vAccessToken') } })
      if (response.data.code === 200) {
        toast.success(response.data.message)
        getTodoList()
      }
    }
    setIsMarkCompleted(false)
    setMarkCompleteId('')
  }

  const handleMarkCompleted = (rowData) => {
    console.log(rowData, '>>>>>handle completed row id')
    setIsMarkCompleted(true)
    setMarkCompleteId(rowData.row._id)
  }

  const getTodoList = async () => {
    // const items = localStorage.getItem('todoList')
    // setTodoList(JSON.parse(items))
    let response = await axios.get(`${apiBaseUrl}/todo`, { headers: { 'access_key': localStorage.getItem('vAccessToken') } })
    setTodoList(response.data.data)
  }

  const handleClose = (formvalues) => {
    setEditId('')
    setIsFormOpen(false)
    getTodoList()
  }

  const columns = [
    { field: '_id', headerName: 'ID', width: 70 },
    { field: 'vTitle', headerName: 'Title', width: 130 },
    { field: 'vDescription', headerName: 'Description', width: 200 },
    {
      field: 'iCreatedAt', headerName: 'Created At', width: 150,
      renderCell: (params) => <div>{moment(params.row.iCreatedAt * 1000).format('MMMM Do YYYY')}</div>
    },
    {
      field: 'iDueDate', headerName: 'Due Date', width: 150,
      renderCell: (params) => <div>{moment(params.row.iDueDate * 1000).format('MMMM Do YYYY')}</div>
    },
    {
      field: 'bMarkCompleted', headerName: 'Status', width: 130,
      renderCell: (params) => <div>{params.row.bMarkCompleted ? <Chip label="Completed" color="success" /> : <Chip onClick={() => handleMarkCompleted(params)} label="Pending" color="primary" />}</div>
    },
    // {
    //   field: 'image', headerName: 'Image', width: 130,
    //   renderCell: (params) => <><img width={'30%'} src={params.row.image} alt='imag' /></>,
    //   // valueGetter: (params) => <><img src={params.row.image} alt='imag' /></>
    // },
    {
      field: 'action', headerName: 'Action', width: 170,
      hide: true,
      renderCell: (params) =>
        <div style={{ outline: "none" }}>
          {params.row.bMarkCompleted === false && <Button
            onClick={(e) => { e.stopPropagation(); handleEdit(params) }}>
            Edit
          </Button>}
          <Button onClick={(e) => { e.stopPropagation(); handleDelete(params) }}>
            Delete
          </Button>
        </div>,
    }
  ];
  return (
    <div style={{ padding: '15px' }}>
      <Button onClick={() => handleAddRecord()} color='warning' variant="contained">+Add Record</Button>
      <div style={{ marginTop: '10px', height: 400, width: '100%' }}>
        {todoList && todoList.length > 0 &&
          <DataGrid
            rows={todoList}
            getRowId={(row) => row._id}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
          // checkboxSelection
          />
        }
      </div>
      {isFormOpen && <AddRecord editId={editId} openDialog={isFormOpen} closeDialog={handleClose} />}
      {isDeleteOpen && <DeleteConfirm message={'Are you sure, you want to delete this task?'} openDialog={isDeleteOpen} closeDialog={handleCloseDeleteConfirm} />}
      {isMarkCompleted && <DeleteConfirm message={'Are you sure, you want to complete this task?'} openDialog={isMarkCompleted} closeDialog={handleCloseCompletedConfirm} />}

    </div>
  )
}