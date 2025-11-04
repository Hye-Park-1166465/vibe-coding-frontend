// 환경변수에서 API URL 가져오기, 없으면 기본값 사용
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/todos';

// 모든 TODO 가져오기
export const fetchTodos = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error('할일 목록을 가져오는데 실패했습니다.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

// TODO 추가하기
export const createTodo = async (title, description = '') => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '할일 추가에 실패했습니다.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};

// TODO 수정하기
export const updateTodo = async (id, title, description) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '할일 수정에 실패했습니다.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

// TODO 삭제하기
export const deleteTodo = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '할일 삭제에 실패했습니다.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};




