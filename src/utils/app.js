import { onMounted, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';


export default function useWorkspacePage() {
  const $q = useQuasar();
  const store = useStore();

  const columns = computed(() => store.getters['board/getColumns']);


  // متغیرهای Ref برای کنترل نمایش دیالوگ‌ها
  const showAddColumnDialog = ref(false);
  const showAddTaskDialog = ref(false);
  const showDeleteColumnDialog = ref(false);
  const showDeleteTaskDialog = ref(false);
  const showEditeTaskDialog = ref(false)
  const showMoveTaskDialog = ref(false)

  // متغیرهای موقت برای نگهداری اطلاعات مربوط به عملیات
  const currentColumnIdForTask = ref(null);
  const currentColumnIdForDelete = ref(null);
  const currentTaskIdForDelete = ref(null);
  const currentColumnIdForEdit = ref(null);
  const currentTaskIdForEdit = ref(null);
  const currentColumnIdForMove = ref(null);

  const draggingTask = ref(null);

  const handleAddColumn = async ({ inputValue: columnName, allowDeleteTask, allowEditTask, allowDeleteColumn, allowEditColumn }) => {
    if (!columnName || columnName.trim().length === 0) {
      $q.notify({
        message: 'column title should not be empty',
        color: 'negative',
        icon: 'warning',
      });
      return;
    }
    try {
      await store.dispatch('board/createColumn', { name: columnName.trim(), tasks: [], allowDeleteTask, allowEditTask, allowDeleteColumn, allowEditColumn });
      $q.notify({
        message: 'column added successfully',
        color: 'positive',
        icon: 'check_circle',
      });
      showAddColumnDialog.value = false;
    } catch (error) {
      $q.notify({
        message: error.message,
        color: 'negative',
        icon: 'warning',
      });
    }
  };

  const handleDeleteColumn = async () => {
    try {
      await store.dispatch('board/removeColumn', currentColumnIdForDelete.value);
      $q.notify({
        message: 'column removed successfully',
        color: 'info',
        icon: 'delete_forever',
      });

      showDeleteColumnDialog.value = false;
    } catch (error) {
      $q.notify({
        message: error.message,
        color: 'negative',
        icon: 'error',
      });
    } finally {
      currentColumnIdForDelete.value = null;
    }
  };

  const handleAddTask = async ({ inputValue: taskTitle }) => {
    if (!taskTitle || taskTitle.trim().length === 0) {
      $q.notify({
        message: 'task title should not be empty',
        color: 'negative',
        icon: 'warning',
      });
      return;
    }
    try {
      await store.dispatch('board/addTask', {
        columnId: currentColumnIdForTask.value,
        newTaskData: { title: taskTitle.trim() },
      });
      $q.notify({
        message: 'task added successfully',
        color: 'positive',
        icon: 'check_circle',
      });

      showAddTaskDialog.value = false;
    } catch (error) {
      $q.notify({
        message: error.message,
        color: 'negative',
        icon: 'warning',
      });
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
      $q.notify({
        message: 'task removed successfully',
        color: 'info',
        icon: 'delete_forever',
      });

      showDeleteTaskDialog.value = false;
    } catch (error) {
      $q.notify({
        message: error.message,
        color: 'negative',
        icon: 'error',
      });
    } finally {
      currentColumnIdForDelete.value = null;
      currentTaskIdForDelete.value = null;
    }
  };

  const handleEditTask = async ({ inputValue: newTaskTitle }) => {
    if (!newTaskTitle || newTaskTitle.trim().length === 0) {
      $q.notify({
        message: 'task title should not be empty',
        color: 'negative',
        icon: 'warning',
      });
      return;
    }
    try {
      await store.dispatch('board/editTask', {
        columnId: currentColumnIdForEdit.value,
        newTaskData: { title: newTaskTitle.trim(), id: currentTaskIdForEdit.value }
      })
      $q.notify({
        message: 'task edited successfully',
        color: 'positive',
        icon: 'check_circle',
      });

      showEditeTaskDialog.value = false;
    } catch (error) {
      $q.notify({
        message: error.message,
        color: 'negative',
        icon: 'error',
      });
    } finally {
      currentColumnIdForEdit.value = null
      currentTaskIdForEdit.value = null
    }

  }

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
    currentTaskIdForEdit.value = taskId
    currentColumnIdForEdit.value = columnId
    showEditeTaskDialog.value = true
  }

  const openMoveTaskDialog = (columnId) => {
    currentColumnIdForMove.value = columnId
    showMoveTaskDialog.value = true
  }

  const onTaskDragStart = (payload) => {
    const { columnId, taskId } = payload
    draggingTask.value = { columnId, taskId }
  }

  const onDragOverColumn = (event) => {
    event.dataTransfer.dropEffect = 'move';
  }

  const onDropConfirm = async (targetColumnId) => {

    if (!draggingTask.value) return

    const sourceColumnId = draggingTask.value.columnId
    const targetColumn = store.getters['board/getColumnById'](targetColumnId);

    if (sourceColumnId === targetColumnId) {
      draggingTask.value = null
      return
    }

    if (targetColumn && !targetColumn.allowEditColumn) {
      $q.notify({
        message: 'you are not allowed to add task in this column',
        color: 'negative',
        icon: 'warning',

      });
      draggingTask.value = null;
      return;
    }
    currentColumnIdForMove.value = targetColumnId;
    showMoveTaskDialog.value = true;

  }

  const handleMoveTaskconfirmation = async () => {
    const sourceColumnId = draggingTask.value.columnId
    const taskId = draggingTask.value.taskId
    const targetColumnId = currentColumnIdForMove.value

    try {
      await store.dispatch('board/moveTask', {
        sourceColumnId,
        targetColumnId,
        taskId
      })

      $q.notify({
        message: 'task moved successfully',
        color: 'positive',
        icon: 'check_circle',
      });

    } catch (error) {
      $q.notify({
        message: error.message || 'error in dropping task',
        color: 'negative',
        icon: 'error'
      });
    } finally {
      draggingTask.value = null;
      currentColumnIdForMove.value = null;
      showMoveTaskDialog.value = false;
    }
  }
  const cancelMoveTask = () => {
    $q.notify({
      message: 'moving task canceled',
      color: 'info',
      icon: 'cancel',
    });
    draggingTask.value = null;
    currentColumnIdForMove.value = null;
    showMoveTaskDialog.value = false;
  };

  onMounted(async () => {
    try {
      await store.dispatch('board/fetchColumns');
    } catch (error) {
      $q.notify({
        message: error.message,
        color: 'negative',
        icon: 'warning',
      });
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