import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

interface Todo {
  id: number;
  text: string;
  createdAt: Date;
}

let todos: Todo[] = [];
let nextId = 1;

app.use(cors());
app.use(express.json());

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const { text } = req.body;
  
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required and must be a string' });
  }

  const newTodo: Todo = {
    id: nextId++,
    text: text.trim(),
    createdAt: new Date()
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
