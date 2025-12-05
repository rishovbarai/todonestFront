export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const useTodos = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;

  const getTodos = async (): Promise<Todo[]> => {
    return await $fetch<Todo[]>(`${apiBase}/todos`);
  };

  const createTodo = async (title: string, order?: number): Promise<Todo> => {
    return await $fetch<Todo>(`${apiBase}/todos`, {
      method: 'POST',
      body: { title, order },
    });
  };

  const updateTodo = async (
    id: number,
    updates: Partial<Todo>,
  ): Promise<Todo> => {
    return await $fetch<Todo>(`${apiBase}/todos/${id}`, {
      method: 'PATCH',
      body: updates,
    });
  };

  const deleteTodo = async (id: number): Promise<void> => {
    await $fetch(`${apiBase}/todos/${id}`, {
      method: 'DELETE',
    });
  };

  const reorderTodos = async (
    todos: { id: number; order: number }[],
  ): Promise<Todo[]> => {
    return await $fetch<Todo[]>(`${apiBase}/todos/reorder`, {
      method: 'POST',
      body: todos,
    });
  };

  return {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    reorderTodos,
  };
};

