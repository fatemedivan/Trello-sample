import { deleteColumn, getColumns, postColumn } from '../../services/columns';
import { updateColumnTasks } from '../../services/tasks';

const actions = {
  async fetchColumns({ commit }) {
    try {
      const data = await getColumns();
      commit('setColumns', data);
    } catch (error) {
      console.log(error);
      commit('setColumns', []);
      throw error;
    }
  },

  async createColumn({ commit, state, dispatch }, newColumnData) {
    try {
      const columnName = newColumnData.name?.trim();
      if (!columnName) {
        throw new Error('Column title should not be empty');
      }
      if (state.columns.some(c => c.name.toLowerCase() === columnName.toLowerCase())) {
        throw new Error('Column with this title already exists.');
      }
      const newColumn = await postColumn(newColumnData);
      commit('addColumnToState', newColumn);

      await dispatch('toggleDialog', { dialogName: 'showAddColumn', value: false });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  async removeColumn({ commit, dispatch }, columnId) {
    try {
      await deleteColumn(columnId);
      commit('removeColumnFromState', columnId);

      await dispatch('toggleDialog', { dialogName: 'showDeleteColumn', value: false });
      await dispatch('setCurrentId', { key: 'currentColumnIdForDelete', value: null });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  async addTask({ commit, state, dispatch }, { columnId, newTaskData }) {
    try {
      const taskTitle = newTaskData.title?.trim();
      if (!taskTitle) {
        throw new Error('Task title should not be empty');
      }
      const column = state.columns.find(col => col.id === columnId);
      if (!column) {
        throw new Error('Column not found.');
      }
      const taskExists = column.tasks.some(task => task.title.toLowerCase() === taskTitle.toLowerCase());
      if (taskExists) {
        throw new Error('Task with this title already exists in this column.');
      }

      const newTaskId = Math.random() + columnId;
      const newTask = {
        id: newTaskId,
        title: taskTitle,
      };

      const updatedTasks = [...column.tasks, newTask];
      await updateColumnTasks(columnId, updatedTasks);

      commit('addTaskToColumnState', { columnId, newTask });

      await dispatch('toggleDialog', { dialogName: 'showAddTask', value: false });
      await dispatch('setCurrentId', { key: 'currentColumnIdForTask', value: null });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  async removeTask({ commit, dispatch, state }, { columnId, taskId }) {
    try {
      const column = state.columns.find(col => col.id === columnId);
      if (!column) {
        throw new Error('Column not found.');
      }
      const updatedTasks = column.tasks.filter(task => task.id !== taskId);
      await updateColumnTasks(columnId, updatedTasks);

      commit('removeTaskFromColumnState', { columnId, taskId });

      await dispatch('toggleDialog', { dialogName: 'showDeleteTask', value: false });
      await dispatch('setCurrentId', { key: 'currentColumnIdForDelete', value: null });
      await dispatch('setCurrentId', { key: 'currentTaskIdForDelete', value: null });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  async editTask({ commit, dispatch, state }, { columnId, newTaskData }) {
    try {
      const newTitle = newTaskData.title?.trim();
      if (!newTitle) {
        throw new Error('Task title should not be empty');
      }

      const column = state.columns.find(col => col.id === columnId);
      if (!column) {
        throw new Error('Column not found.');
      }
      const taskIndex = column.tasks.findIndex(task => task.id === newTaskData.id);
      if (taskIndex === -1) {
        throw new Error('Task not found in this column.');
      }

      const originalTask = column.tasks[taskIndex];
      if (newTitle.toLowerCase() !== originalTask.title.toLowerCase()) {
        const titleExists = column.tasks.some(
          (task, idx) => idx !== taskIndex && task.title.toLowerCase() === newTitle.toLowerCase()
        );
        if (titleExists) {
          throw new Error('Another task with this title already exists in this column.');
        }
      }

      const updatedTask = { ...newTaskData, title: newTitle };

      const newTasksArray = [...column.tasks];
      newTasksArray[taskIndex] = updatedTask;
      await updateColumnTasks(columnId, newTasksArray);

      commit('editTaskInColumnState', { columnId, updatedTask });

      await dispatch('toggleDialog', { dialogName: 'showEditTask', value: false });
      await dispatch('setCurrentId', { key: 'currentColumnIdForEdit', value: null });
      await dispatch('setCurrentId', { key: 'currentTaskIdForEdit', value: null });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  async moveTask({ commit, dispatch, state }, { sourceColumnId, targetColumnId, taskId }) {
    try {
      const sourceColumn = state.columns.find(col => col.id === sourceColumnId);
      const targetColumn = state.columns.find(col => col.id === targetColumnId);

      if (!sourceColumn) throw new Error('Source column not found');
      if (!targetColumn) throw new Error('Target column not found');

      const taskIndex = sourceColumn.tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) throw new Error('Task not found in source column');

      const taskToMove = sourceColumn.tasks[taskIndex];
      const updatedSourceTasks = sourceColumn.tasks.filter(task => task.id !== taskId);
      const updatedTargetTasks = [...targetColumn.tasks, taskToMove];

      await updateColumnTasks(sourceColumnId, updatedSourceTasks);
      await updateColumnTasks(targetColumnId, updatedTargetTasks);

      commit('moveTaskInState', { sourceColumnId, targetColumnId, taskId, taskToMove });

      await dispatch('setDraggingTask', null);
      await dispatch('setCurrentId', { key: 'currentColumnIdForMove', value: null });
      await dispatch('toggleDialog', { dialogName: 'showMoveTask', value: false });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  async setColumnForMovingTask({ getters, dispatch, state }, targetColumnId) {
    const dragging = state.draggingTask;

    if (!dragging) return;

    const sourceColumnId = dragging.columnId;
    const targetColumn = getters.getColumnById(targetColumnId);

    if (sourceColumnId === targetColumnId) {
    await  dispatch('setDraggingTask', null);
      return;
    }

    if (targetColumn && !targetColumn.allowEditColumn) {
    await  dispatch('setDraggingTask', null);
      throw new Error('You are not allowed to add task in this column')
    }

    await dispatch('setCurrentId', {
      key: 'currentColumnIdForMove',
      value: targetColumnId,
    });

    await dispatch('toggleDialog', {
      dialogName: 'showMoveTask',
      value: true,
    });
  },

  cancelMoveTask({ dispatch }) {
    dispatch('setDraggingTask', null);
    dispatch('setCurrentId', { key: 'currentColumnIdForMove', value: null });
    dispatch('toggleDialog', { dialogName: 'showMoveTask', value: false });
  },

  toggleDialog({ commit }, { dialogName, value }) {
    commit('setDialogState', { dialogName, value });
  },

  setCurrentId({ commit }, { key, value }) {
    commit('setCurrentId', { key, value });
  },

  setDraggingTask({ commit }, payload) {
    commit('setDraggingTask', payload);
  },
};

export default actions;
