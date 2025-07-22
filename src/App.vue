<template>
  <QLayout>
    <QPageContainer>
      <q-page padding class="dark-mode-page">
        <h4 class="q-my-md text-center text-white">welcome to your workspace</h4>

        <div class="q-my-xl flex justify-center">
          <q-btn label="Add New Column" icon="add" color="primary" @click="openAddColumnDialog" />
        </div>

        <div class="row items-start kanban-columns-container">
          <q-card v-for="column in columns" :key="column.id" class="kanban-column-wrapper"
            @dragover.prevent='onDragOverColumn' @drop="() => onDropConfirm(column.id)">
            <q-card-section class="kanban-column-header q-pb-none">
              <div class="text-h6 flex justify-between items-center">
                <span>{{ column.name }} ({{ column.tasks?.length }})</span>
                <div>
                  <q-btn v-if="column.allowEditColumn" icon="add" flat round dense
                    @click="() => openAddTaskDialog(column.id)" />
                  <q-btn v-if="column.allowDeleteColumn" icon="delete" flat round dense color="negative"
                    @click="() => openDeleteColumnDialog(column.id)" />
                </div>
              </div>
            </q-card-section>

            <q-card-section>
              <q-list separator class="q-mt-sm kanban-task-list">
                <TaskItem @task-drag-start="onTaskDragStart" v-for="task in column.tasks" :key="task.id"
                  :title="task.title" :openDeleteTaskDialog="openDeleteTaskDialog"
                  :openEditeTaskDialog="openEditTaskDialog" :columnId="column.id" :taskId="task.id"
                  :allowDeleteTask="column.allowDeleteTask" :allowEditTask="column.allowEditTask" />

                <q-item v-if="column.tasks?.length === 0" class="kanban-empty-message">
                  <q-item-section>No tasks available.</q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <BaseDialog v-model="showAddColumnDialog" title="Add New Column" message="Enter column name:" prompt
          promptType="text" promptLabel="Column Name" okButtonLabel="Add" :isDarkMode="true" @ok="handleAddColumn"
          :showDeleteTaskCheckBox="true" :showEditTaskCheckBox="true" :showDeleteColumnCheckBox="true"
          :showEditColumnCheckBox="true" />

        <BaseDialog v-model="showAddTaskDialog" title="Add New Task" message="Enter task title:" prompt
          promptType="text" promptLabel="Task Title" okButtonLabel="Add" :isDarkMode="true" @ok="handleAddTask" />

        <BaseDialog v-model="showDeleteColumnDialog" title="Delete Column"
          message="Are you sure you want to delete this column and all its tasks?" okButtonLabel="Delete"
          okButtonColor="negative" :isDarkMode="true" @ok="handleDeleteColumn" />

        <BaseDialog v-model="showDeleteTaskDialog" title="Delete Task"
          message="Are you sure you want to delete this task?" okButtonLabel="Delete" okButtonColor="negative"
          :isDarkMode="true" @ok="handleDeleteTask" />

        <BaseDialog v-model="showEditTaskDialog" message="Enter new task title:" title="Edit Task" okButtonLabel="Add"
          prompt promptType="text" promptLabel="New Task Title" :isDarkMode="true" @ok="handleEditTask" />

        <BaseDialog v-model="showMoveTaskDialog" title="Move Task"
          message="Are you sure you want to move this task in this column?" okButtonLabel="Move"
          :isDarkMode="true" @ok="handleMoveTaskconfirmation" @cancel="cancelMoveTask"/>

      </q-page>
    </QPageContainer>
  </QLayout>
</template>

<script setup>
import useWorkspacePage from './utils/app';
import BaseDialog from './components/‌BaseDialog.vue';
import TaskItem from './components/TaskItem.vue';

const {
  columns,
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

    onTaskDragStart,
    onDragOverColumn,
    onDropConfirm,
} = useWorkspacePage();
</script>

<style>
@import './assets/css/app.css';
</style>