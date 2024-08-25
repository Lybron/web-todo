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
  Typography,
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { TodoListForm } from './TodoListForm'
import AddIcon from '@mui/icons-material/Add'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import DeleteIcon from '@mui/icons-material/Delete'

export const TodoLists = ({ style }) => {
  const [todoLists, setTodoLists] = useState([])
  const [activeList, setActiveList] = useState()

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
            {todoLists.map((list) => (
              <ListItemButton key={list.id} onClick={() => setActiveList(list)}>
                <ListItemIcon>
                  {list.isCompleted ? <CheckCircleIcon color='success' /> : <ReceiptIcon />}
                </ListItemIcon>
                <ListItemText primary={list.title} />
                <Button>
                  <EditRoundedIcon />
                </Button>
                <Button
                  sx={{ margin: '8px' }}
                  size='small'
                  color='secondary'
                  onClick={() => {
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
            const allCompleted = todos.every((x) => x.isCompleted)
            if (allCompleted !== activeList.isCompleted) {
              activeList.isCompleted = allCompleted
              console.log(allCompleted, activeList.isCompleted)
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
