const getters = {
  getColumns: (state) => state.columns,
  getColumnById: (state) => (id) => {
    return state.columns.find(column => column.id === id);
  },
  getTaskById: (state) => (columnId, taskId) => {
    const column = state.columns.find(col => col.id === columnId);
    if (!column) return null;
    return column.tasks.find(task => task.id === taskId);
  },
}

export default getters
