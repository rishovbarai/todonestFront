<template>
  <div class="task-item">
    <div class="task-details">
      <div class="radio-btn">
        <input
          type="checkbox"
          :checked="task.completed"
          :disabled="isToggling"
          @change="toggleComplete"
          class="radio-input"
          :class="{ 'loading': isToggling }"
        />
        <span v-if="isToggling" class="checkbox-loader"></span>
      </div>
      <span class="task-text" :class="{ completed: task.completed }">
        {{ task.title }}
      </span>
    </div>
    <div class="action-buttons">
      <button class="btn-edit" @click="$emit('edit', task.id)" aria-label="Edit task">
        <img :src="editIcon" alt="Edit" class="edit-icon" />
      </button>
      <button class="btn-delete" @click="$emit('delete', task.id)" aria-label="Delete task">
        <img :src="deleteIcon" alt="Delete" class="delete-icon" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Todo } from '~/composables/useTodos';
import editIcon from '~/assets/images/edit-icon.png';
import deleteIcon from '~/assets/images/delete-icon.png';

interface Props {
  task: Todo;
  isToggling?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isToggling: false,
});
const emit = defineEmits<{
  edit: [id: number];
  delete: [id: number];
  toggle: [id: number];
}>();

const toggleComplete = () => {
  emit('toggle', props.task.id);
};
</script>

<style scoped lang="scss">
.task-item {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1062px;
  height: 64px;
  padding: 16px;
  background: #FFFFFF;
  border: 1px solid #D0D0D0;
  border-width: 1px;
  border-radius: 4px;
  opacity: 1;
  flex: none;
  align-self: stretch;
}

.task-details {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 8px;
  height: 24px;
  flex: none;
  order: 0;
}

.radio-btn {
  width: 24px;
  height: 24px;
  flex: none;
  order: 0;
  position: relative;
}

.radio-input {
  width: 100%;
  height: 100%;
  margin: 0;
  cursor: pointer;
  appearance: none;
  box-sizing: border-box;
  background: #FAFAFA;
  border: 1.5px solid #D0D0D0;
  border-radius: 50%;
  position: relative;
  transition: opacity 0.2s;
  
  &:checked {
    background: #FFC627;
    border-color: #FFC627;
    
    &::after {
      content: '';
      position: absolute;
      width: 9.45px;
      height: 6.5px;
      left: calc(50% - 9.45px / 2 + 0.23px);
      top: calc(50% - 6.5px / 2 + 0.25px);
      border-left: 2.4px solid #000000;
      border-bottom: 2.4px solid #000000;
      transform: rotate(-45deg);
      transform-origin: center;
      border-radius: 0;
      background: transparent;
      box-sizing: border-box;
    }
  }
  
  &:hover:not(:disabled) {
    border-color: #8C1D40;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &.loading {
    opacity: 0.7;
  }
}

.checkbox-loader {
  position: absolute;
  width: 16px;
  height: 16px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid #D0D0D0;
  border-top-color: #8C1D40;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.task-text {
  height: 24px;
  font-family: 'Arial';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
  color: #191919;
  flex: none;
  order: 1;
  
  &.completed {
    text-decoration: line-through;
  }
}

.action-buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 8px;
  width: 72px;
  height: 32px;
  flex: none;
  order: 1;
}

.btn-edit,
.btn-delete {
  width: 32px;
  height: 32px;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:active {
    opacity: 0.6;
  }
}

.btn-edit {
  background: #8C1D40;
  order: 0;
  position: relative;
  
  .edit-icon {
    position: absolute;
    width: 16px;
    height: 16px;
    left: 8px;
    top: 8px;
    object-fit: contain;
  }
}

.btn-delete {
  background: #F1F1F1;
  order: 1;
  position: relative;
  
  .delete-icon {
    position: absolute;
    width: 16px;
    height: 16px;
    left: 8px;
    top: 8px;
    object-fit: contain;
  }
}

// Mobile styles
@media (max-width: 768px) {
  .task-item {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 16px;
    gap: 10px;
    width: 100%;
    max-width: 345px;
    min-height: 80px;
    height: auto;
    background: #FFFFFF;
    border: 1px solid #D0D0D0;
    border-radius: 4px;
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
    overflow: hidden;
  }

  .task-details {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 16px;
    min-width: 0;
    min-height: 48px;
    height: auto;
    flex: 1;
    order: 0;
    overflow: hidden;
  }

  .task-text {
    min-width: 0;
    max-width: 185px;
    min-height: 48px;
    height: auto;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    color: #191919;
    flex: 1;
    order: 1;
    word-wrap: break-word;
    overflow-wrap: break-word;
    overflow: hidden;
  }

  .action-buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 8px;
    width: 72px;
    height: 32px;
    flex: none;
    order: 2;
    flex-grow: 0;
    flex-shrink: 0;
  }
}
</style>

