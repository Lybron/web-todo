import React, { useEffect, useState, useCallback } from 'react'
import { TextField, Card, CardContent, CardActions, Button, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded'

export const TodoListForm = ({ todoList, checkCompleted }) => {
  const [todos, setTodos] = useState([])

  const baseURL = 'http://localhost:3001'

  // Fetch Todo items from the server for a specific TodoList
  const fetchTodos = useCallback(async () => {
    let response = await fetch(`${baseURL}/todo/${todoList.id}`)
    return response.json()
  }, [todoList.id])

  // Save a Todo item on the server
  const saveTodoItem = async (todo) => {
    if (!todo.title) {
      return false
    }

    todo.dueDate = new Date(todo.dueDate).toString() === 'Invalid Date' ? null : todo.dueDate

    const response = await fetch(`${baseURL}/todo/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...todo, listId: todoList.id }),
    })
    return response.ok
  }

  // Delete a Todo item on the server
  const deleteTodoItem = async (todo) => {
    const response = await fetch(`${baseURL}/todo/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    })

    return response.ok
  }

  // Mark a Todo item as complete/incomplete
  const markCompleted = async (todo) => {
    todo.isCompleted = !todo.isCompleted
    return await saveTodoItem(todo)
  }

  // Update the TodoList completion status a Todo's status changes
  const updateCompleted = (items) => {
    checkCompleted(items)
  }

  // Update the list of Todo items on the frontend
  const updateTodos = () => {
    fetchTodos().then((fetched) => {
      setTodos(fetched)
      updateCompleted(fetched)
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  useEffect(() => {
    fetchTodos().then((fetched) => {
      setTodos(fetched)
    })
  }, [fetchTodos])

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{todoList.title}</Typography>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
        >
          {todos.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <Button
                sx={{ margin: '8px' }}
                size='small'
                color='secondary'
                disabled={!item.id}
                onClick={() => {
                  markCompleted(item).then((success) => {
                    if (success) {
                      updateTodos()
                    }
                  })
                }}
              >
                {item.isCompleted ? (
                  <CheckCircleIcon color='success' />
                ) : (
                  <RadioButtonUncheckedRoundedIcon />
                )}
              </Button>
              <TextField
                sx={{ flexGrow: 1, marginTop: '1rem' }}
                label='What to do?'
                value={item.title}
                onChange={(event) => {
                  setTodos([
                    // immutable update
                    ...todos.slice(0, index),
                    { ...item, title: event.target.value },
                    ...todos.slice(index + 1),
                  ])
                }}
                onBlur={() => {
                  saveTodoItem(item).then(() => {
                    updateTodos()
                  })
                }}
              />
              <input
                type='date'
                value={item.dueDate || ''}
                disabled={item.isCompleted || !item.id}
                onChange={(event) => {
                  setTodos([
                    ...todos.slice(0, index),
                    { ...item, dueDate: event.target.value },
                    ...todos.slice(index + 1),
                  ])
                }}
                onBlur={() => {
                  saveTodoItem(item).then(() => {
                    updateTodos()
                  })
                }}
                style={{
                  marginLeft: '8px',
                  marginTop: '1rem',
                  height: '20px',
                  padding: '16.5px 14px',
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 0, 0, 0.23)',
                  fontSize: '16px',
                }}
              />
              <Button
                sx={{ margin: '8px' }}
                size='small'
                color='secondary'
                disabled={!item.id}
                onClick={() => {
                  deleteTodoItem(item).then((success) => {
                    if (success) {
                      updateTodos()
                    }
                  })
                }}
              >
                <DeleteIcon />
              </Button>
            </div>
          ))}
          <CardActions>
            <Button
              type='button'
              color='primary'
              onClick={() => {
                const newTodo = {
                  title: '',
                  isCompleted: false,
                  createdAt: Date.now(),
                }

                setTodos([...todos, newTodo])
              }}
            >
              Add Todo <AddIcon />
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  )
}
