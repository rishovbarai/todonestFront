<template>
  <div class="landing-page">
    <AppHeader />
    
    <div class="task-container">
      <div class="task-info">
        <h2 class="task-title">Task</h2>
        <p class="task-description">Monitor all yours tasks here</p>
      </div>
      <button class="btn-add-task" @click="showAddModal = true">
        Add Task
      </button>
    </div>

    <div class="task-list-container">
      <div class="task-header">
        <span class="header-label">Task</span>
        <span class="header-label action-label">Action</span>
      </div>
      
      <div class="divider"></div>
      
      <!-- Delete Success Alert -->
      <div v-if="showDeleteSuccess" class="delete-success-alert">
        <div class="alert-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#191919"/>
            <path d="M8 12L11 15L16 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="alert-text">The task has been successfully deleted.</span>
        <button class="alert-close" @click="dismissSuccessAlert" aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" fill="#FFFFFF" stroke="#D0D0D0"/>
            <path d="M8 8L16 16M16 8L8 16" stroke="#747474" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- Edit Success Alert -->
      <div v-if="showEditSuccess" class="edit-success-alert">
        <div class="alert-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#191919"/>
            <path d="M8 12L11 15L16 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="alert-text">The task has been successfully edited.</span>
        <button class="alert-close" @click="dismissEditSuccessAlert" aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" fill="#FFFFFF" stroke="#D0D0D0"/>
            <path d="M8 8L16 16M16 8L8 16" stroke="#747474" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      
      <div class="task-list">
        <TaskItem
          v-for="task in todos"
          :key="task.id"
          :task="task"
          @edit="handleEdit"
          @delete="handleDelete"
          @toggle="handleToggle"
        />
      </div>
      
      <button class="btn-add-bottom" @click="showAddModal = true">
        Add Task
      </button>
    </div>

    <!-- Mobile Bottom Container -->
    <div class="mobile-bottom-container">
      <button class="btn-add-mobile" @click="showAddModal = true">
        Add Task
      </button>
    </div>

    <!-- Add/Edit Task Modal -->
    <div v-if="showAddModal || editingTask" class="edit-modal-overlay" @click="closeModal">
      <div class="edit-modal-container" @click.stop>
        <div class="edit-modal">
          <div class="edit-modal-header">
            <div class="edit-modal-title-wrapper">
              <h3 class="edit-modal-title">{{ editingTask ? 'Edit Task' : 'Add Task' }}</h3>
            </div>
            <button class="edit-modal-close" @click="closeModal" aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 4L12 12M12 4L4 12" stroke="#191919" stroke-width="2.29" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="edit-modal-content">
            <div class="edit-input-wrapper">
              <div class="edit-input-label">
                <span class="label-text">Task</span>
              </div>
              <div class="edit-input-field">
                <input
                  v-model="taskInput"
                  type="text"
                  placeholder="Enter task title"
                  class="edit-task-input"
                  @keyup.enter="saveTask"
                />
              </div>
            </div>
          </div>
          <div class="edit-modal-footer">
            <button v-if="editingTask" class="btn-delete-task" @click="handleDeleteFromEdit">Delete</button>
            <div class="edit-footer-buttons">
              <button class="btn-edit-cancel" @click="closeModal">Cancel</button>
              <button class="btn-edit-save" @click="saveTask">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Task Modal -->
    <div v-if="showDeleteModal" class="delete-modal-overlay" @click="closeDeleteModal">
      <div class="delete-modal-container" @click.stop>
        <div class="delete-modal">
          <div class="delete-modal-header">
            <div class="delete-modal-title-wrapper">
              <h3 class="delete-modal-title">Delete Task</h3>
            </div>
            <button class="delete-modal-close" @click="closeDeleteModal" aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 4L12 12M12 4L4 12" stroke="#191919" stroke-width="2.29" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="delete-modal-content">
            <div class="delete-modal-label">
              <span class="delete-confirmation-text">
                Are you sure you want to delete this task? This action cannot be undone.
              </span>
            </div>
          </div>
          <div class="delete-modal-footer">
            <button class="btn-delete-cancel" @click="closeDeleteModal">Cancel</button>
            <button class="btn-delete-confirm" @click="confirmDelete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Todo } from '~/composables/useTodos';

const { getTodos, createTodo, updateTodo, deleteTodo } = useTodos();

const todos = ref<Todo[]>([]);
const showAddModal = ref(false);
const showDeleteModal = ref(false);
const editingTask = ref<Todo | null>(null);
const deletingTask = ref<Todo | null>(null);
const taskInput = ref('');
const showDeleteSuccess = ref(false);
const showEditSuccess = ref(false);

onMounted(async () => {
  await loadTodos();
});

const loadTodos = async () => {
  try {
    todos.value = await getTodos();
  } catch (error) {
    console.error('Failed to load todos:', error);
  }
};

const handleEdit = (id: number) => {
  const task = todos.value.find(t => t.id === id);
  if (task) {
    editingTask.value = task;
    taskInput.value = task.title;
    showAddModal.value = true;
  }
};

const handleDelete = (id: number) => {
  const task = todos.value.find(t => t.id === id);
  if (task) {
    deletingTask.value = task;
    showDeleteModal.value = true;
  }
};

const handleDeleteFromEdit = () => {
  if (editingTask.value) {
    closeModal();
    handleDelete(editingTask.value.id);
  }
};

const confirmDelete = async () => {
  if (deletingTask.value) {
    try {
      await deleteTodo(deletingTask.value.id);
      await loadTodos();
      closeDeleteModal();
      showDeleteSuccess.value = true;
      // Auto-hide after 3 seconds
      setTimeout(() => {
        showDeleteSuccess.value = false;
      }, 3000);
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  }
};

const dismissSuccessAlert = () => {
  showDeleteSuccess.value = false;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  deletingTask.value = null;
};

const handleToggle = async (id: number) => {
  const task = todos.value.find(t => t.id === id);
  if (task) {
    try {
      await updateTodo(id, { completed: !task.completed });
      await loadTodos();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  }
};

const closeModal = () => {
  showAddModal.value = false;
  editingTask.value = null;
  taskInput.value = '';
};

const saveTask = async () => {
  if (!taskInput.value.trim()) return;

  try {
    const wasEditing = !!editingTask.value;
    if (editingTask.value) {
      await updateTodo(editingTask.value.id, { title: taskInput.value.trim() });
    } else {
      await createTodo(taskInput.value.trim(), todos.value.length);
    }
    await loadTodos();
    closeModal();
    
    // Show success message
    if (wasEditing) {
      showEditSuccess.value = true;
      setTimeout(() => {
        showEditSuccess.value = false;
      }, 3000);
    }
  } catch (error) {
    console.error('Failed to save todo:', error);
  }
};

const dismissEditSuccessAlert = () => {
  showEditSuccess.value = false;
};
</script>

<style scoped lang="scss">
.landing-page {
  position: relative;
  min-height: 832px;
  background: #FFFFFF;
  padding: 0;
  overflow-x: hidden;
}

.task-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  gap: 732px;
  position: absolute;
  width: 1110px;
  height: 50px;
  left: calc((100% - 1110px) / 2);
  top: 160px;
}

.task-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 4px;
  width: 243px;
  height: 50px;
  flex: none;
  order: 0;
}

.task-title {
  width: 243px;
  height: 28px;
  font-family: 'Arial';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  letter-spacing: -0.035em;
  color: #191919;
  margin: 0;
  flex: none;
  order: 0;
  align-self: stretch;
}

.task-description {
  width: 243px;
  height: 18px;
  font-family: 'Arial';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  color: #747474;
  margin: 0;
  flex: none;
  order: 1;
  align-self: stretch;
}

.btn-add-task {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  gap: 10px;
  width: 135px;
  height: 32px;
  background: #191919;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  flex: none;
  order: 1;
  
  font-family: 'Arial';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  color: #FAFAFA;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    opacity: 0.8;
  }
}

.task-list-container {
  box-sizing: border-box;
  position: absolute;
  width: 1110px;
  height: 544px;
  left: calc((100% - 1110px) / 2);
  top: 242px;
  background: #FAFAFA;
  border-radius: 4px;
}

.task-header {
  position: absolute;
  width: calc(100% - 48px);
  max-width: 1019px;
  height: 24px;
  left: 24px;
  top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-label {
  font-family: 'Arial';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
  color: #191919;
}

.action-label {
  position: relative;
  right: auto;
  top: auto;
  width: 45px;
}

.divider {
  position: absolute;
  width: calc(100% - 48px);
  max-width: 1062px;
  height: 1px;
  left: 24px;
  top: 48px;
  background: #D9D9D9;
  z-index: 1;
}

.delete-success-alert,
.edit-success-alert {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 16px;
  gap: 16px;
  position: absolute;
  height: 56px;
  background: #E9F5DB;
  border: 1px solid #446D12;
  z-index: 10;
}

.delete-success-alert {
  width: 396.03px;
  left: calc(50% - 396.03px / 2 + 0.02px);
  top: calc(50% - 56px / 2 + 220px);
}

.edit-success-alert {
  width: 388.03px;
  left: calc(50% - 388.03px / 2 + 0.02px);
  top: 464px;
}

.alert-icon {
  width: 24px;
  height: 24px;
  flex: none;
  order: 0;
  flex-grow: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 24px;
    height: 24px;
  }
}

.alert-text {
  width: auto;
  min-width: 284px;
  height: 24px;
  font-family: 'Arial';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #191919;
  flex: none;
  order: 1;
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.edit-success-alert .alert-text {
  width: 276px;
  flex-grow: 0;
}

.alert-close {
  width: 24.03px;
  height: 24px;
  flex: none;
  order: 2;
  flex-grow: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 0.7;
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
}

.task-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 16px;
  position: absolute;
  width: calc(100% - 48px);
  max-width: 1062px;
  height: 384px;
  left: 24px;
  top: 72px;
  overflow-y: auto;
}

.btn-add-bottom {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  gap: 10px;
  position: absolute;
  width: 123px;
  height: 32px;
  right: 24px;
  top: 488px;
  background: #191919;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  
  font-family: 'Arial';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  color: #FAFAFA;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    opacity: 0.8;
  }
}

// Edit Modal Styles
.edit-modal-overlay {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  background: rgba(25, 25, 25, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.edit-modal-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 28px 0px;
  position: absolute;
  width: 500px;
  height: 276px;
  left: calc(50% - 500px / 2);
  top: calc(50% - 276px / 2);
}

.edit-modal {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  width: 500px;
  height: 220px;
  background: #FFFFFF;
  border: 1px solid #D0D0D0;
  flex: none;
  order: 0;
  align-self: stretch;
}

.edit-modal-header {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 16px;
  gap: 8px;
  width: 498px;
  height: 55px;
  border-bottom: 1px solid #D0D0D0;
  flex: none;
  order: 0;
  align-self: stretch;
}

.edit-modal-title-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0px;
  width: 442px;
  height: 22px;
  background: rgba(255, 255, 255, 1e-06);
  flex: none;
  order: 0;
  flex-grow: 1;
}

.edit-modal-title {
  width: 442px;
  height: 22px;
  font-family: 'Arial';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  display: flex;
  align-items: center;
  letter-spacing: -0.035em;
  color: #191919;
  margin: 0;
  flex: none;
  order: 0;
  align-self: stretch;
}

.edit-modal-close {
  width: 16px;
  height: 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  order: 1;
  flex-grow: 0;
  
  &:hover {
    opacity: 0.7;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
}

.edit-modal-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  gap: 24px;
  width: 498px;
  height: 106px;
  overflow-y: scroll;
  flex: none;
  order: 1;
  align-self: stretch;
}

.edit-input-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  isolation: isolate;
  width: 466px;
  height: 74px;
  background: rgba(255, 255, 255, 1e-06);
  flex: none;
  order: 0;
  align-self: stretch;
}

.edit-input-label {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  padding: 0px 0px 8px;
  gap: 4px;
  width: 466px;
  height: 32px;
  background: rgba(255, 255, 255, 1e-06);
  flex: none;
  order: 0;
  align-self: stretch;
  z-index: 2;
}

.label-text {
  width: 101px;
  height: 24px;
  font-family: 'Arial';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #191919;
  flex: none;
  order: 1;
  flex-grow: 0;
  display: flex;
  align-items: center;
}

.edit-input-field {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  width: 466px;
  height: 42px;
  background: #FFFFFF;
  border: 1px solid #D0D0D0;
  flex: none;
  order: 1;
  align-self: stretch;
  z-index: 1;
}

.edit-task-input {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 4px;
  width: 432px;
  height: 24px;
  flex: none;
  order: 0;
  flex-grow: 1;
  border: none;
  outline: none;
  font-family: 'Arial';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #191919;
  
  &::placeholder {
    color: #191919;
  }
}

.edit-modal-footer {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  gap: 8px;
  width: 498px;
  height: 57px;
  border-top: 1px solid #D0D0D0;
  flex: none;
  order: 2;
  align-self: stretch;
}

.btn-delete-task {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 8px 16px;
  gap: 10px;
  margin: 0 auto;
  width: 75px;
  height: 32px;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  flex: none;
  order: 0;
  flex-grow: 0;
  background: transparent;
  
  font-family: 'Arial';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  color: #CC2F2F;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:active {
    opacity: 0.6;
  }
}

.edit-footer-buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 8px;
  margin: 0 auto;
  width: 154px;
  height: 32px;
  flex: none;
  order: 1;
  flex-grow: 0;
}

.btn-edit-cancel {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  gap: 10px;
  width: 78px;
  height: 32px;
  background: #F1F1F1;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  flex: none;
  order: 0;
  flex-grow: 0;
  
  font-family: 'Arial';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  color: #191919;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    opacity: 0.8;
  }
}

.btn-edit-save {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  gap: 10px;
  width: 68px;
  height: 32px;
  background: #FFC627;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  flex: none;
  order: 1;
  flex-grow: 0;
  
  font-family: 'Arial';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  color: #191919;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    opacity: 0.8;
  }
}

// Hide mobile bottom container on desktop
.mobile-bottom-container {
  display: none;
}

// Delete Modal Styles
.delete-modal-overlay {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  background: rgba(25, 25, 25, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.delete-modal-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 28px 0px;
  position: absolute;
  width: 500px;
  height: 258px;
  left: calc(50% - 500px / 2);
  top: calc(50% - 258px / 2);
}

.delete-modal {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  width: 500px;
  height: 202px;
  background: #FFFFFF;
  border: 1px solid #D0D0D0;
  flex: none;
  order: 0;
  align-self: stretch;
}

.delete-modal-header {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 16px;
  gap: 8px;
  width: 498px;
  height: 55px;
  border-bottom: 1px solid #D0D0D0;
  flex: none;
  order: 0;
  align-self: stretch;
}

.delete-modal-title-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0px;
  width: 442px;
  height: 22px;
  background: rgba(255, 255, 255, 1e-06);
  flex: none;
  order: 0;
  flex-grow: 1;
}

.delete-modal-title {
  width: 442px;
  height: 22px;
  font-family: 'Arial';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  display: flex;
  align-items: center;
  letter-spacing: -0.035em;
  color: #191919;
  margin: 0;
  flex: none;
  order: 0;
  align-self: stretch;
}

.delete-modal-close {
  width: 16px;
  height: 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  order: 1;
  flex-grow: 0;
  
  &:hover {
    opacity: 0.7;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
}

.delete-modal-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  gap: 24px;
  width: 498px;
  height: 88px;
  overflow-y: scroll;
  flex: none;
  order: 1;
  align-self: stretch;
}

.delete-modal-label {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  padding: 0px 0px 8px;
  gap: 4px;
  width: 466px;
  height: 56px;
  background: rgba(255, 255, 255, 1e-06);
  flex: none;
  order: 0;
  align-self: stretch;
}

.delete-confirmation-text {
  width: 357px;
  height: 48px;
  font-family: 'Arial';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #191919;
  flex: none;
  order: 0;
  flex-grow: 0;
}

.delete-modal-footer {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 12px;
  gap: 8px;
  width: 498px;
  height: 57px;
  border-top: 1px solid #D0D0D0;
  flex: none;
  order: 2;
  align-self: stretch;
}

.btn-delete-cancel {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  gap: 10px;
  width: 78px;
  height: 32px;
  background: #F1F1F1;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  flex: none;
  order: 0;
  flex-grow: 0;
  
  font-family: 'Arial';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  color: #191919;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    opacity: 0.8;
  }
}

.btn-delete-confirm {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  gap: 10px;
  width: 75px;
  height: 32px;
  background: #FFC627;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  flex: none;
  order: 1;
  flex-grow: 0;
  
  font-family: 'Arial';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  color: #191919;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    opacity: 0.8;
  }
}

// Mobile Delete Modal Styles
@media (max-width: 768px) {
  .delete-modal-overlay {
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
  }

  .delete-modal-container {
    width: 375px;
    height: 240px;
    left: 0px;
    bottom: 0px;
    top: auto;
    transform: none;
    padding: 0;
  }

  .delete-modal {
    width: 375px;
    height: 240px;
    border-radius: 4px 4px 0px 0px;
    border: none;
  }

  .delete-modal-header {
    position: absolute;
    width: 375px;
    height: 55px;
    left: 0px;
    top: 0px;
    padding: 16px;
  }

  .delete-modal-title-wrapper {
    width: 319px;
    height: 22px;
  }

  .delete-modal-title {
    width: 319px;
    height: 22px;
    font-size: 18px;
    line-height: 22px;
  }

  .delete-modal-content {
    position: absolute;
    width: 343px;
    height: 72px;
    left: 16px;
    top: 79px;
    padding: 0;
    overflow: visible;
  }

  .delete-modal-label {
    width: 343px;
    height: 72px;
    padding: 0;
    align-items: flex-start;
  }

  .delete-confirmation-text {
    width: 343px;
    height: 72px;
    font-size: 16px;
    line-height: 24px;
  }

  .delete-modal-footer {
    position: absolute;
    width: 374px;
    height: 65px;
    left: 1px;
    bottom: 0px;
    padding: 16px;
  }

  .btn-delete-cancel {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 167px;
    height: 32px;
    flex-grow: 1;
  }

  .btn-delete-confirm {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 167px;
    height: 32px;
    flex-grow: 1;
  }
}

// Mobile styles
@media (max-width: 768px) {
  .landing-page {
    position: relative;
    width: 100%;
    max-width: 375px;
    min-height: 832px;
    margin: 0 auto;
    padding-bottom: 82px;
  }

  .task-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 24px;
    position: absolute;
    width: calc(100% - 30px);
    max-width: 345px;
    height: 64px;
    left: 15px;
    top: 136px;
  }

  .task-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 4px;
    width: 100%;
    max-width: 345px;
    height: 64px;
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
  }

  .task-title {
    width: 100%;
    max-width: 345px;
    height: 36px;
    font-size: 24px;
    line-height: 36px;
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
  }

  .task-description {
    width: 100%;
    max-width: 345px;
    height: 24px;
    font-size: 16px;
    line-height: 24px;
    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
  }

  .btn-add-task {
    display: none;
  }

  .task-list-container {
    position: absolute;
    width: 100%;
    max-width: 375px;
    min-height: 488px;
    max-height: calc(100vh - 224px - 82px);
    height: auto;
    left: 0px;
    top: 224px;
    background: #FAFAFA;
    border-radius: 0;
    overflow-y: auto;
  }

  .task-header {
    display: none;
  }

  .divider {
    display: none;
  }

  .delete-success-alert,
  .edit-success-alert {
    width: calc(100% - 32px);
    max-width: 343px;
    height: 56px;
    left: 50%;
    transform: translateX(-50%);
  }

  .delete-success-alert {
    top: calc(50% - 56px / 2 + 180px);
  }

  .edit-success-alert {
    top: calc(50% - 56px / 2 + 180px);
  }

  .alert-text {
    width: auto;
    min-width: 231px;
    flex-grow: 1;
  }

  .task-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 16px;
    position: relative;
    width: calc(100% - 30px);
    max-width: 345px;
    min-height: 0;
    height: auto;
    left: 15px;
    top: 24px;
    overflow-y: visible;
    padding-bottom: 24px;
  }

  .btn-add-bottom {
    display: none;
  }

  .mobile-bottom-container {
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
    gap: 10px;
    position: fixed;
    width: 100%;
    max-width: 375px;
    height: 82px;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0px;
    background: #FFFFFF;
    border-top: 1px solid #D0D0D0;
    z-index: 100;
  }

  .btn-add-mobile {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px 32px;
    gap: 10px;
    width: 100%;
    max-width: 343px;
    height: 50px;
    background: #191919;
    border-radius: 25px;
    border: none;
    cursor: pointer;
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
    
    font-family: 'Arial';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 18px;
    color: #FAFAFA;
    
    &:hover {
      opacity: 0.9;
    }
    
    &:active {
      opacity: 0.8;
    }
  }

  .modal-content {
    width: 90%;
    max-width: 343px;
  }

  // Mobile Edit Modal Styles
  .edit-modal-overlay {
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
  }

  .edit-modal-container {
    width: 100%;
    max-width: 375px;
    height: 276px;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0px;
    top: auto;
    padding: 0;
  }

  .edit-modal {
    width: 100%;
    max-width: 375px;
    height: 220px;
    border-radius: 4px 4px 0px 0px;
    border: none;
  }

  .edit-modal-header {
    width: 100%;
    max-width: 375px;
    height: 55px;
    padding: 16px;
  }

  .edit-modal-title-wrapper {
    width: 100%;
    max-width: 319px;
    height: 22px;
  }

  .edit-modal-title {
    width: 100%;
    max-width: 319px;
    height: 22px;
    font-size: 18px;
    line-height: 22px;
  }

  .edit-modal-content {
    width: calc(100% - 32px);
    max-width: 343px;
    height: 106px;
    padding: 16px;
    gap: 24px;
  }

  .edit-task-input-wrapper {
    width: 100%;
    max-width: 311px;
    height: 74px;
  }

  .edit-task-label {
    width: 100%;
    max-width: 101px;
    height: 24px;
  }

  .edit-task-input {
    width: 100%;
    max-width: 311px;
    height: 42px;
    padding: 8px 16px;
  }

  .edit-modal-footer {
    width: 100%;
    max-width: 375px;
    height: 57px;
    padding: 12px;
  }

  .btn-edit-cancel {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 78px;
    height: 32px;
  }

  .btn-edit-save {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 68px;
    height: 32px;
  }
}

// Hide mobile bottom container on desktop
.mobile-bottom-container {
  display: none;
}

@media (max-width: 768px) {
  .mobile-bottom-container {
    display: flex;
  }
}
</style>
