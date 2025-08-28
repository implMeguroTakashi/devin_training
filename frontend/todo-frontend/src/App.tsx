import { useState, useEffect } from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { RefreshCw, Plus } from 'lucide-react'

interface Todo {
  id: number;
  text: string;
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/todos`);
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async () => {
    if (!inputValue.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputValue.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo');
      }

      const newTodo = await response.json();
      setTodos(prev => [...prev, newTodo]);
      setInputValue('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Todoリスト
          </h1>
          
          <p className="text-center text-gray-600 mb-6">
            {getCurrentDate()}
          </p>

          <div className="flex gap-2 mb-6">
            <Input
              type="text"
              placeholder="新しいタスクを入力..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={addTodo} 
              disabled={isLoading || !inputValue.trim()}
              className="px-4"
            >
              <Plus className="w-4 h-4 mr-1" />
              追加
            </Button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              タスク一覧 ({todos.length})
            </h2>
            <Button 
              variant="outline" 
              onClick={fetchTodos}
              disabled={isLoading}
              className="px-3"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              再読み込み
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              エラー: {error}
            </div>
          )}

          <div className="space-y-2">
            {todos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {isLoading ? 'ロード中...' : 'タスクがありません'}
              </div>
            ) : (
              todos.map((todo) => (
                <div 
                  key={todo.id} 
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-gray-800 flex-1">{todo.text}</span>
                    <span className="text-sm text-gray-500 ml-4">
                      {new Date(todo.createdAt).toLocaleString('ja-JP')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
