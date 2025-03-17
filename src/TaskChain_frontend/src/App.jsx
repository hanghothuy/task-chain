import React, { useState, useEffect } from "react";
import { TaskChain_backend } from "../../declarations/TaskChain_backend";
import styled from "styled-components";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    status: { Pending: null },
  });
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const taskList = await TaskChain_backend.getTasks();
      setTasks(taskList);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const createTask = async () => {
    if (!newTask.name || !newTask.description) return;
    try {
      await TaskChain_backend.createTask(
        newTask.name,
        newTask.description,
        newTask.status
      );
      fetchTasks();
      setNewTask({ name: "", description: "", status: { Pending: null } });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const updateTask = async () => {
    if (!editingTask) return;
    try {
      await TaskChain_backend.updateTask(editingTask.id, {
        name: editingTask.name,
        description: editingTask.description,
        status: { [editingTask.status]: null },
      });
      fetchTasks();
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await TaskChain_backend.deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <Container>
      <Title>Task Manager</Title>
      <div>
        <Input
          type="text"
          placeholder="Task Name"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
        />
        <Input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <Button onClick={createTask}>Add Task</Button>
      </div>
      <TaskList>
        {tasks.map((task) => (
          <TaskItem key={task.id} status={Object.keys(task.status)[0]}>
            {editingTask?.id === task.id ? (
              <>
                <Input
                  type="text"
                  value={editingTask.name}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, name: e.target.value })
                  }
                />
                <Input
                  type="text"
                  value={editingTask.description}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      description: e.target.value,
                    })
                  }
                />
                <Select
                  value={editingTask.status}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, status: e.target.value })
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Completed">Completed</option>
                </Select>
                <Button onClick={updateTask}>Save</Button>
                <Button danger onClick={() => setEditingTask(null)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <span>
                  {task.name} - {task.description} (
                  {Object.keys(task.status)[0]})
                </span>
                <div>
                  <Button onClick={() => setEditingTask(task)}>Edit</Button>
                  <Button danger onClick={() => deleteTask(task.id)}>
                    Delete
                  </Button>
                </div>
              </>
            )}
          </TaskItem>
        ))}
      </TaskList>
    </Container>
  );
};

const Container = styled.div`
  max-width: 600px;
  margin: auto;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Select = styled.select`
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Input = styled.input`
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: ${(props) => (props.danger ? "#ff4d4d" : "#4CAF50")};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const TaskList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TaskItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  border: 1px solid #ddd;
  background-color: ${({ status }) => {
    switch (status) {
      case "Pending":
        return "#fff3cd";
      case "Ongoing":
        return "#d1ecf1";
      case "Cancelled":
        return "#f8d7da";
      case "Completed":
        return "#d4edda";
      default:
        return "#ffffff";
    }
  }};
`;

export default App;
