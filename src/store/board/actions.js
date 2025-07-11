
import { deleteColumn, getColumns, postColumn } from '../../services/columns'
import { updateColumnTasks } from '../../services/tasks'

const actions = {
  async fetchColumns({ commit }) {
    try {
      const data = await getColumns()
      commit('setColumns', data)
    } catch (error) {
      console.log('Error fetching columns in Vuex action:', error)
      commit('setColumns', [])
      throw error
    }
  },
  async createColumn({ commit, state }, newColumnData) {
    try {
      const columnExists = state.columns.some(col => col.name.toLowerCase() === newColumnData.name.trim().toLowerCase())
      if (columnExists) {
        throw new Error('Column with this title already exists.')
      }
      const newColumn = await postColumn(newColumnData)
      commit('addColumnToState', newColumn)
    } catch (error) {
      console.error('Error creating column in Vuex action:', error)
      throw error
    }
  },
  async removeColumn({ commit }, columnId) {
    try {
      await deleteColumn(columnId)
      commit('removeColumnFromState', columnId)
    } catch (error) {
      console.error('Error deleting column in Vuex action:', error)
      throw error
    }
  },
  async addTask({ commit, state }, { columnId, newTaskData }) {
    try {
      const column = state.columns.find(col => col.id === columnId);
      if (!column) {
        throw new Error('Column not found.');
      }
      const taskExits = column.tasks.some(task => task.title.toLowerCase() === newTaskData.title.trim().toLowerCase())
      if (taskExits) {
        throw new Error('Task with this title already exists in this column.')
      }
      const newTaskId = Math.random() + columnId;
      const newTask = {
        id: newTaskId,
        title: newTaskData.title.trim(),
      };

      const updatedTasks = [...column.tasks, newTask];

      await updateColumnTasks(columnId, updatedTasks);

      commit('addTaskToColumnState', { columnId, newTask });
    } catch (error) {
      console.error('Error adding task in Vuex action:', error);
      throw error;
    }
  },

  async removeTask({ commit, state }, { columnId, taskId }) {
    try {
      const column = state.columns.find(col => col.id === columnId);
      if (!column) {
        throw new Error('Column not found.');
      }

      const updatedTasks = column.tasks.filter(task => task.id !== taskId);

      await updateColumnTasks(columnId, updatedTasks);

      commit('removeTaskFromColumnState', { columnId, taskId });
    } catch (error) {
      console.error('Error deleting task in Vuex action:', error);
      throw error;
    }
  },
}

export default actions
