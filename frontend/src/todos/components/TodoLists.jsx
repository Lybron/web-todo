import React, { Fragment, useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  TextField,
  Typography,
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { TodoListForm } from './TodoListForm'
import AddIcon from '@mui/icons-material/Add'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SaveIcon from '@mui/icons-material/Save'

import DeleteIcon from '@mui/icons-material/Delete'

export const TodoLists = ({ style }) => {
  const [todoLists, setTodoLists] = useState([])
  const [activeList, setActiveList] = useState()
  const [editing, setEditing] = useState()

  const baseURL = 'http://localhost:3001'

  // Fetch TodoLists from the server
  const fetchTodoLists = async () => {
    const response = await fetch(`${baseURL}/todo-lists`)
    return response.json()
  }

  // Save a TodoList on the server
  const saveTodoList = async (list) => {
    const response = await fetch(`${baseURL}/todo-lists/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(list),
    })
    return response.ok
  }

  // Delete a TodoList on the server
  const deleteTodoList = async (list) => {
    const response = await fetch(`${baseURL}/todo-lists/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(list),
    })
    return response.ok
  }

  // Update the list of TodoLists on the frontend
  const updateLists = () => {
    fetchTodoLists().then(setTodoLists)
  }

  const toggeleEditing = async (list) => {
    if (!list.title) {
      return
    }

    if (editing === list.id) {
      setEditing()
      await saveTodoList(list)
      updateLists()
      return
    }

    setEditing(list.id)
  }

  useEffect(() => {
    fetchTodoLists().then(setTodoLists)
  }, [])

  return (
    <Fragment>
      <Card style={style}>
        <CardContent>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography component='h2'>My Todo Lists</Typography>
            <Button
              type='button'
              color='primary'
              onClick={() => {
                saveTodoList({ title: `List ${todoLists.length + 1}` }).then((success) => {
                  if (success) {
                    fetchTodoLists().then((lists) => {
                      setTodoLists(lists)
                      setActiveList(lists[lists.length - 1])
                    })
                  }
                })
              }}
            >
              New List <AddIcon />
            </Button>
          </Box>
          <List>
            {todoLists.map((list, index) => (
              <ListItemButton key={list.id} onClick={() => setActiveList(list)}>
                <ListItemIcon>
                  {list.isCompleted ? <CheckCircleIcon color='success' /> : <ReceiptIcon />}
                </ListItemIcon>
                {editing === list.id ? (
                  <TextField
                    fullWidth
                    sx={{ flexGrow: 1, marginTop: '1rem' }}
                    label='Set list title:'
                    value={list.title}
                    onChange={(event) => {
                      setTodoLists([
                        ...todoLists.slice(0, index),
                        { ...list, title: event.target.value },
                        ...todoLists.slice(index + 1),
                      ])
                    }}
                    onBlur={() => {
                      toggeleEditing(list)
                    }}
                  />
                ) : (
                  <ListItemText primary={list.title} />
                )}

                <Button
                  sx={{ margin: '8px' }}
                  size='small'
                  disabled={(editing && editing !== list.id) || !list.title}
                  onClick={(event) => {
                    event.stopPropagation()
                    toggeleEditing(list)
                  }}
                >
                  {editing === list.id ? <SaveIcon /> : <EditRoundedIcon />}
                </Button>
                <Button
                  sx={{ margin: '8px' }}
                  size='small'
                  color='secondary'
                  disabled={!!editing}
                  onClick={(event) => {
                    event.stopPropagation()
                    deleteTodoList(list).then((success) => {
                      if (success) {
                        fetchTodoLists().then((lists) => {
                          setTodoLists(lists)
                          if (list.id === activeList.id) {
                            setActiveList()
                          }
                        })
                      }
                    })
                  }}
                >
                  <DeleteIcon />
                </Button>
              </ListItemButton>
            ))}
          </List>
        </CardContent>
      </Card>
      {activeList && (
        <TodoListForm
          key={activeList.id} // use key to make React recreate component to reset internal state
          todoList={activeList}
          checkCompleted={(todos) => {
            const allCompleted = todos.length > 0 ? todos.every((x) => x.isCompleted) : false

            if (allCompleted !== activeList.isCompleted) {
              activeList.isCompleted = allCompleted
              saveTodoList(activeList).then((success) => {
                if (success) {
                  updateLists()
                }
              })
            }
          }}
        />
      )}
    </Fragment>
  )
}
