import { onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import useNotifier from './Notif';

export default function useWorkspacePage() {
  const store = useStore();
  const { notify } = useNotifier();

  // --- Getters
  const columns = computed(() => store.getters['board/getColumns']);
  const draggingTask = computed(() => store.getters['board/draggingTask']);

  const getDialog = (name) => computed(() => store.getters['board/getDialogState'](name));
  const showAddColumnDialog = getDialog('showAddColumn');
  const showAddTaskDialog = getDialog('showAddTask');
  const showDeleteColumnDialog = getDialog('showDeleteColumn');
  const showDeleteTaskDialog = getDialog('showDeleteTask');
  const showEditTaskDialog = getDialog('showEditTask');
  const showMoveTaskDialog = getDialog('showMoveTask');

  // --- State
  const currentColumnIdForTask = computed(() => store.state.board.currentColumnIdForTask);
  const currentColumnIdForDelete = computed(() => store.state.board.currentColumnIdForDelete);
  const currentTaskIdForDelete = computed(() => store.state.board.currentTaskIdForDelete);
  const currentColumnIdForEdit = computed(() => store.state.board.currentColumnIdForEdit);
  const currentTaskIdForEdit = computed(() => store.state.board.currentTaskIdForEdit);
  const currentColumnIdForMove = computed(() => store.state.board.currentColumnIdForMove);

  // --- Lifecycle
  onMounted(async () => {
    try {
      await store.dispatch('board/fetchColumns');
    } catch (error) {
      notify({ message: error.message, type: 'negative' });
    }
  });

  // --- Actions

  const handleAddColumn = async ({ inputValue: columnName, allowDeleteTask, allowEditTask, allowDeleteColumn, allowEditColumn }) => {
    try {
      await store.dispatch('board/createColumn', {
        name: columnName.trim(),
        tasks: [],
        allowDeleteTask,
        allowEditTask,
        allowDeleteColumn,
        allowEditColumn
      });
      notify({ message: 'Column added successfully', type: 'positive' });
    } catch (error) {
      notify({ message: error.message, type: 'negative', icon: 'warning' });
    }
  };

  const handleDeleteColumn = async () => {
    try {
      await store.dispatch('board/removeColumn', currentColumnIdForDelete.value);
      notify({ message: 'Column removed successfully', type: 'info', icon: 'delete_forever' });
    } catch (error) {
      notify({ message: error.message, type: 'negative' });
    }
  };

  const handleAddTask = async ({ inputValue }) => {
    try {
      await store.dispatch('board/addTask', {
        columnId: currentColumnIdForTask.value,
        newTaskData: { title: inputValue?.trim() },
      });
      notify({ message: 'Task added successfully', type: 'positive' });
    } catch (error) {
      notify({ message: error.message, type: 'negative', icon: 'warning' });
    }
  };

  const handleDeleteTask = async () => {
    try {
      await store.dispatch('board/removeTask', {
        columnId: currentColumnIdForDelete.value,
        taskId: currentTaskIdForDelete.value,
      });
      notify({ message: 'Task removed successfully', type: 'info', icon: 'delete_forever' });
    } catch (error) {
      notify({ message: error.message, type: 'negative' });
    }
  };

  const handleEditTask = async ({ inputValue }) => {
    try {
      await store.dispatch('board/editTask', {
        columnId: currentColumnIdForEdit.value,
        newTaskData: {
          id: currentTaskIdForEdit.value,
          title: inputValue?.trim(),
        },
      });
      notify({ message: 'Task edited successfully', type: 'positive' });
    } catch (error) {
      notify({ message: error.message, type: 'negative' });
    }
  };

  const handleMoveTaskconfirmation = async () => {
    try {
      await store.dispatch('board/moveTask', {
        sourceColumnId: draggingTask.value?.columnId,
        targetColumnId: currentColumnIdForMove.value,
        taskId: draggingTask.value?.taskId,
      });
      notify({ message: 'Task moved successfully', type: 'positive' });
    } catch (error) {
      notify({ message: error.message || 'Error in moving task', type: 'negative' });
    }
  };

  // --- Drag-Drop
  const onTaskDragStart = ({ columnId, taskId }) => {
    store.dispatch('board/setDraggingTask', { columnId, taskId });
  };

  const onDragOverColumn = (event) => {
    event.dataTransfer.dropEffect = 'move';
  };
  const onDropConfirm = async (targetColumnId) => {
    try {
      await store.dispatch('board/setColumnForMovingTask', targetColumnId);    
    } catch (error) {
       notify({ message: error.message, type: 'negative' });
    }
  };

  const cancelMoveTask = () => {
    notify({ message: 'Task move cancelled', type: 'info', icon: 'cancel' });
    store.dispatch('board/cancelMoveTask');
  };

  // --- Dialog controls
  const openAddColumnDialog = () =>
    store.dispatch('board/toggleDialog', { dialogName: 'showAddColumn', value: true });

  const openAddTaskDialog = (columnId) => {
    store.dispatch('board/setCurrentId', { key: 'currentColumnIdForTask', value: columnId });
    store.dispatch('board/toggleDialog', { dialogName: 'showAddTask', value: true });
  };

  const openDeleteColumnDialog = (columnId) => {
    store.dispatch('board/setCurrentId', { key: 'currentColumnIdForDelete', value: columnId });
    store.dispatch('board/toggleDialog', { dialogName: 'showDeleteColumn', value: true });
  };

  const openDeleteTaskDialog = (columnId, taskId) => {
    store.dispatch('board/setCurrentId', { key: 'currentColumnIdForDelete', value: columnId });
    store.dispatch('board/setCurrentId', { key: 'currentTaskIdForDelete', value: taskId });
    store.dispatch('board/toggleDialog', { dialogName: 'showDeleteTask', value: true });
  };

  const openEditTaskDialog = (columnId, taskId) => {
    store.dispatch('board/setCurrentId', { key: 'currentColumnIdForEdit', value: columnId });
    store.dispatch('board/setCurrentId', { key: 'currentTaskIdForEdit', value: taskId });
    store.dispatch('board/toggleDialog', { dialogName: 'showEditTask', value: true });
  };

  const openMoveTaskDialog = (columnId, taskId) => {
    store.dispatch('board/setCurrentId', { key: 'currentColumnIdForMove', value: columnId });
    store.dispatch('board/setDraggingTask', { columnId, taskId });
    store.dispatch('board/toggleDialog', { dialogName: 'showMoveTask', value: true });
  };

  return {
    columns,
    draggingTask,
    showAddColumnDialog,
    showAddTaskDialog,
    showDeleteColumnDialog,
    showDeleteTaskDialog,
    showEditTaskDialog,
    showMoveTaskDialog,

    handleAddColumn,
    handleDeleteColumn,
    handleAddTask,
    handleDeleteTask,
    handleEditTask,
    handleMoveTaskconfirmation,
    cancelMoveTask,

    openAddColumnDialog,
    openAddTaskDialog,
    openDeleteColumnDialog,
    openDeleteTaskDialog,
    openEditTaskDialog,
    openMoveTaskDialog,
    onTaskDragStart,
    onDragOverColumn,
    onDropConfirm,
  };
}
