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
}

export default mutations
