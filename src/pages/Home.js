import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import AddRecord from '../dialog/AddRecord';
import DeleteConfirm from '../dialog/DeleteConfirm';

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [todoList, setTodoList] = useState([]);;
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  useEffect(() => {
    getTodoList()
  }, [])

  const handleAddRecord = () => {
    setIsFormOpen(true)
  }
  const handleEdit = (rowData) => {
    console.log(rowData)
  }
  const handleDelete = (rowData) => {
    console.log(rowData)
    setIsDeleteOpen(true)
  }
  const handleCloseDeleteConfirm = (value) => {
    console.log(value)
    setIsDeleteOpen(false)
  }

  const getTodoList = () => {
    const items = localStorage.getItem('todoList')
    setTodoList(JSON.parse(items))
    console.log(JSON.parse(items))
  }

  const handleClose = (formvalues) => {
    setIsFormOpen(false)
    getTodoList()
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'startDate', headerName: 'Start Date', width: 130 },
    { field: 'endDate', headerName: 'End Date', width: 130 },
    { field: 'status', headerName: 'Status', width: 130 },
    {
      field: 'image', headerName: 'Image', width: 130,
      renderCell: (params) => <><img width={'30%'} src={params.row.image} alt='imag' /></>,
      // valueGetter: (params) => <><img src={params.row.image} alt='imag' /></>
    },
    {
      field: 'action', headerName: 'Action', width: 170,
      hide: true,
      renderCell: (params) =>
        <div style={{ outline: "none" }}>
          <Button
            onClick={(e) => { e.stopPropagation(); handleEdit(params) }}>
            Edit
          </Button>
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
        {todoList.length > 0 &&
          <DataGrid
            rows={todoList}
            getRowId={(row) => row.id}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
          />
        }
      </div>
      {isFormOpen && <AddRecord openDialog={isFormOpen} closeDialog={handleClose} />}
      {isDeleteOpen && <DeleteConfirm openDialog={isDeleteOpen} closeDialog={handleCloseDeleteConfirm} />}
    </div>
  )
}