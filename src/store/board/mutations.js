const mutations = {
  setColumns(state, columns) {
    state.columns = columns || []
  },
  addColumnToState(state, newColumn) {
    state.columns.push(newColumn)
  },
  removeColumnFromState(state, columnId) {
    state.columns = state.columns.filter((col) => col.id !== columnId)
  },
  addTaskToColumnState(state, { columnId, newTask }) {
    const columnIndex = state.columns.findIndex((col) => col.id === columnId)
    if (columnIndex !== -1) {
      state.columns[columnIndex].tasks.push(newTask)
    }
  },
  removeTaskFromColumnState(state, { columnId, taskId }) {
    const columnIndex = state.columns.findIndex((col) => col.id === columnId)
    if (columnIndex !== -1) {
      state.columns[columnIndex].tasks = state.columns[columnIndex].tasks.filter(
        (task) => task.id !== taskId,
      )
    }
  },
 editTaskInColumnState(state, { columnId, updatedTask }) { 
    const columnIndex = state.columns.findIndex((col) => col.id === columnId);
    if (columnIndex !== -1) {
      const taskIndex = state.columns[columnIndex].tasks.findIndex(
        (task) => task.id === updatedTask.id
      );
      if (taskIndex !== -1) {
        state.columns[columnIndex].tasks[taskIndex] = updatedTask;
      }
    }
  },
   moveTaskInState(state, { sourceColumnId, targetColumnId, taskId, taskToMove }) {
    const sourceColumnIndex = state.columns.findIndex(col => col.id === sourceColumnId)
    const targetColumnIndex = state.columns.findIndex(col => col.id === targetColumnId)
   
    if (sourceColumnIndex !== -1 && targetColumnIndex !== -1) {
      state.columns[sourceColumnIndex].tasks = state.columns[sourceColumnIndex].tasks.filter(task => task.id !== taskId)
      state.columns[targetColumnIndex].tasks.push(taskToMove)
    }
    
  },
}

export default mutations
