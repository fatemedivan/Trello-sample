import { onMounted, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';


export default function useWorkspacePage() {
  const $q = useQuasar();
  const store = useStore();

  const columns = computed(() => store.state.board.columns);

  // متغیرهای Ref برای کنترل نمایش دیالوگ‌ها
  const showAddColumnDialog = ref(false);
  const showAddTaskDialog = ref(false);
  const showDeleteColumnDialog = ref(false);
  const showDeleteTaskDialog = ref(false);

  // متغیرهای موقت برای نگهداری اطلاعات مربوط به عملیات
  const currentColumnIdForTask = ref(null);
  const currentColumnIdForDelete = ref(null);
  const currentTaskIdForDelete = ref(null);

  const handleAddColumn = async (columnName) => {
    if (!columnName || columnName.trim().length === 0) {
      $q.notify({
        message: 'column title should not be empty',
        color: 'negative',
        icon: 'warning',
      });
      return;
    }
    try {
      await store.dispatch('board/createColumn', { name: columnName.trim(), tasks: [] });
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

  const handleAddTask = async (taskTitle) => {
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
    handleAddColumn,
    handleDeleteColumn,
    handleAddTask,
    handleDeleteTask,
    openAddTaskDialog,
    openDeleteColumnDialog,
    openDeleteTaskDialog,
  };
}