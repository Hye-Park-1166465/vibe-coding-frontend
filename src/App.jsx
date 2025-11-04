import { useState, useEffect } from 'react';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api';
import './App.css';

// 환경변수에서 API_URL 읽기
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  // 할일 목록 가져오기
  const loadTodos = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  // 할일 추가
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const created = await createTodo(newTodo.title.trim(), newTodo.description.trim());
      setTodos([created, ...todos]);
      setNewTodo({ title: '', description: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 할일 수정 시작
  const handleStartEdit = (todo) => {
    setEditingId(todo._id);
    setEditForm({ title: todo.title, description: todo.description || '' });
    setError('');
  };

  // 할일 수정 취소
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: '', description: '' });
  };

  // 할일 수정 완료
  const handleUpdateTodo = async (id) => {
    if (!editForm.title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const updated = await updateTodo(id, editForm.title.trim(), editForm.description.trim());
      setTodos(todos.map(todo => todo._id === id ? updated : todo));
      setEditingId(null);
      setEditForm({ title: '', description: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 할일 삭제
  const handleDeleteTodo = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>할일 목록</h1>

        {/* 에러 메시지 */}
        {error && <div className="error-message">{error}</div>}

        {/* 할일 추가 폼 */}
        <form onSubmit={handleAddTodo} className="todo-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="제목을 입력하세요"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              className="form-input"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="설명을 입력하세요 (선택사항)"
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              className="form-textarea"
              rows="3"
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '추가 중...' : '할일 추가'}
          </button>
        </form>

        {/* 할일 목록 */}
        {loading && todos.length === 0 ? (
          <div className="loading">로딩 중...</div>
        ) : todos.length === 0 ? (
          <div className="empty-state">할일이 없습니다. 새로운 할일을 추가해보세요!</div>
        ) : (
          <div className="todo-list">
            {todos.map((todo) => (
              <div key={todo._id} className="todo-item">
                {editingId === todo._id ? (
                  // 수정 모드
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="form-input"
                      disabled={loading}
                    />
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="form-textarea"
                      rows="2"
                      disabled={loading}
                    />
                    <div className="edit-actions">
                      <button
                        onClick={() => handleUpdateTodo(todo._id)}
                        className="btn btn-save"
                        disabled={loading}
                      >
                        저장
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="btn btn-cancel"
                        disabled={loading}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  // 보기 모드
                  <>
                    <div className="todo-content">
                      <h3 className="todo-title">{todo.title}</h3>
                      {todo.description && (
                        <p className="todo-description">{todo.description}</p>
                      )}
                      <div className="todo-meta">
                        <span className="todo-date">
                          생성: {new Date(todo.createdAt).toLocaleString('ko-KR')}
                        </span>
                        {todo.updatedAt && todo.updatedAt !== todo.createdAt && (
                          <span className="todo-date">
                            수정: {new Date(todo.updatedAt).toLocaleString('ko-KR')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="todo-actions">
                      <button
                        onClick={() => handleStartEdit(todo)}
                        className="btn btn-edit"
                        disabled={loading}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteTodo(todo._id)}
                        className="btn btn-delete"
                        disabled={loading}
                      >
                        삭제
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
