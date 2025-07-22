const state = () => ({
  columns: [],

  dialogs: {
    showAddColumn: false,
    showAddTask: false,
    showDeleteColumn: false,
    showDeleteTask: false,
    showEditTask: false,
    showMoveTask: false,
  },

  currentColumnIdForTask: null,
  currentColumnIdForDelete: null,
  currentTaskIdForDelete: null,
  currentColumnIdForEdit: null,
  currentTaskIdForEdit: null,
  currentColumnIdForMove: null,

  draggingTask: null,
})

export default state
