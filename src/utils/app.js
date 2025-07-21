import { onMounted, ref, computed } from 'vue';
import { useStore } from 'vuex';
import useNotifier from './Notif';

export default function useWorkspacePage() {
  const store = useStore();
  const { notify } = useNotifier();

  const columns = computed(() => store.getters['board/getColumns']);

  const showAddColumnDialog = ref(false);
  const showAddTaskDialog = ref(false);
  const showDeleteColumnDialog = ref(false);
  const showDeleteTaskDialog = ref(false);
  const showEditeTaskDialog = ref(false);
  const showMoveTaskDialog = ref(false);

  const currentColumnIdForTask = ref(null);
  const currentColumnIdForDelete = ref(null);
  const currentTaskIdForDelete = ref(null);
  const currentColumnIdForEdit = ref(null);
  const currentTaskIdForEdit = ref(null);
  const currentColumnIdForMove = ref(null);
  const draggingTask = ref(null);

  const handleAddColumn = async ({ inputValue: columnName, allowDeleteTask, allowEditTask, allowDeleteColumn, allowEditColumn }) => {
    if (!columnName?.trim()) {
      return notify({ message: 'column title should not be empty', type: 'negative', icon: 'warning' });
    }
    try {
      await store.dispatch('board/createColumn', {
        name: columnName.trim(),
        tasks: [],
        allowDeleteTask,
        allowEditTask,
        allowDeleteColumn,
        allowEditColumn
      });
      notify({ message: 'column added successfully', type: 'positive' });
      showAddColumnDialog.value = false;
    } catch (error) {
      notify({ message: error.message, type: 'negative' });
    }
  };

  const handleDeleteColumn = async () => {
    try {
      await store.dispatch('board/removeColumn', currentColumnIdForDelete.value);
      notify({ message: 'column removed successfully', type: 'info', icon: 'delete_forever' });
      showDeleteColumnDialog.value = false;
    } catch (error) {
      notify({ message: error.message, type: 'negative' });
    } finally {
      currentColumnIdForDelete.value = null;
    }
  };

  const handleAddTask = async ({ inputValue: taskTitle }) => {
    if (!taskTitle?.trim()) {
      return notify({ message: 'task title should not be empty', type: 'negative', icon: 'warning' });
    }
    try {
      await store.dispatch('board/addTask', {
        columnId: currentColumnIdForTask.value,
        newTaskData: { title: taskTitle.trim() },
      });
      notify({ message: 'task added successfully', type: 'positive' });
      showAddTaskDialog.value = false;
    } catch (error) {
      notify({ message: error.message, type: 'negative' });
    } finally {
      currentColumnIdForTask.value = null;
    }
  };

  const handleDeleteTask = async () => {
    try {
      await store.dispatch('board/removeTask', {
        columnId: currentColumnIdForDelete.value,
        taskId: currentTaskIdForDelete.value,
      });
      notify({ message: 'task removed successfully', type: 'info', icon: 'delete_forever' });
      showDeleteTaskDialog.value = false;
    } catch (error) {
      notify({ message: error.message, type: 'negative' });
    } finally {
      currentColumnIdForDelete.value = null;
      currentTaskIdForDelete.value = null;
    }
  };

  const handleEditTask = async ({ inputValue: newTaskTitle }) => {
    if (!newTaskTitle?.trim()) {
      return notify({ message: 'task title should not be empty', type: 'negative' });
    }
    try {
      await store.dispatch('board/editTask', {
        columnId: currentColumnIdForEdit.value,
        newTaskData: {
          id: currentTaskIdForEdit.value,
          title: newTaskTitle.trim()
        }
      });
      notify({ message: 'task edited successfully', type: 'positive' });
      showEditeTaskDialog.value = false;
    } catch (error) {
      notify({ message: error.message, type: 'negative' });
    } finally {
      currentColumnIdForEdit.value = null;
      currentTaskIdForEdit.value = null;
    }
  };

  const handleMoveTaskconfirmation = async () => {
    const sourceColumnId = draggingTask.value.columnId;
    const taskId = draggingTask.value.taskId;
    const targetColumnId = currentColumnIdForMove.value;

    try {
      await store.dispatch('board/moveTask', {
        sourceColumnId,
        targetColumnId,
        taskId
      });
      notify({ message: 'task moved successfully', type: 'positive' });
    } catch (error) {
      notify({ message: error.message || 'error in dropping task', type: 'negative' });
    } finally {
      draggingTask.value = null;
      currentColumnIdForMove.value = null;
      showMoveTaskDialog.value = false;
    }
  };

  const cancelMoveTask = () => {
    notify({ message: 'moving task canceled', type: 'info', icon: 'cancel' });
    draggingTask.value = null;
    currentColumnIdForMove.value = null;
    showMoveTaskDialog.value = false;
  };

  const openAddTaskDialog = (columnId) => {
    currentColumnIdForTask.value = columnId;
    showAddTaskDialog.value = true;
  };

  const openDeleteColumnDialog = (columnId) => {
    currentColumnIdForDelete.value = columnId;
    showDeleteColumnDialog.value = true;
  };

  const openDeleteTaskDialog = (columnId, taskId) => {
    currentColumnIdForDelete.value = columnId;
    currentTaskIdForDelete.value = taskId;
    showDeleteTaskDialog.value = true;
  };

  const openEditeTaskDialog = (columnId, taskId) => {
    currentTaskIdForEdit.value = taskId;
    currentColumnIdForEdit.value = columnId;
    showEditeTaskDialog.value = true;
  };

  const openMoveTaskDialog = (columnId) => {
    currentColumnIdForMove.value = columnId;
    showMoveTaskDialog.value = true;
  };

  const onTaskDragStart = (payload) => {
    const { columnId, taskId } = payload;
    draggingTask.value = { columnId, taskId };
  };

  const onDragOverColumn = (event) => {
    event.dataTransfer.dropEffect = 'move';
  };

  const onDropConfirm = async (targetColumnId) => {
    if (!draggingTask.value) return;

    const sourceColumnId = draggingTask.value.columnId;
    const targetColumn = store.getters['board/getColumnById'](targetColumnId);

    if (sourceColumnId === targetColumnId) {
      draggingTask.value = null;
      return;
    }

    if (targetColumn && !targetColumn.allowEditColumn) {
      notify({
        message: 'you are not allowed to add task in this column',
        type: 'negative',
        icon: 'warning',
      });
      draggingTask.value = null;
      return;
    }

    currentColumnIdForMove.value = targetColumnId;
    showMoveTaskDialog.value = true;
  };

  onMounted(async () => {
    try {
      await store.dispatch('board/fetchColumns');
    } catch (error) {
      notify({ message: error.message, type: 'negative' });
    }
  });

  return {
    columns,
    showAddColumnDialog,
    showAddTaskDialog,
    showDeleteColumnDialog,
    showDeleteTaskDialog,
    showEditeTaskDialog,
    showMoveTaskDialog,
    handleAddColumn,
    handleDeleteColumn,
    handleAddTask,
    handleDeleteTask,
    handleEditTask,
    handleMoveTaskconfirmation,
    cancelMoveTask,
    openAddTaskDialog,
    openDeleteColumnDialog,
    openDeleteTaskDialog,
    openEditeTaskDialog,
    openMoveTaskDialog,
    onTaskDragStart,
    onDragOverColumn,
    onDropConfirm
  };
}