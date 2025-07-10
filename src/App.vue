<template>
  <QLayout>
    <QPageContainer>
      <q-page padding class="dark-mode-page">
        <h4 class="q-my-md text-center text-white">welcome to your workspace</h4>

        <div class="q-my-xl flex justify-center">
          <q-btn label="Add New Column" icon="add" color="primary" @click="showAddColumnDialog = true" />
        </div>

        <div class="row items-start kanban-columns-container">
          <q-card v-for="column in columns" :key="column.id" class="kanban-column-wrapper">
            <q-card-section class="kanban-column-header q-pb-none">
              <div class="text-h6 flex justify-between items-center">
                <span>{{ column.name }} ({{ column.tasks.length }})</span>
                <div>
                  <q-btn icon="add" flat round dense @click="openAddTaskDialog(column.id)" />
                  <q-btn icon="delete" flat round dense color="negative" @click="openDeleteColumnDialog(column.id)" />
                </div>
              </div>
            </q-card-section>

            <q-card-section>
              <q-list separator class="q-mt-sm kanban-task-list">
                <q-item v-for="task in column.tasks" :key="task.id" class="q-my-sm q-py-sm kanban-task-item">
                  <q-item-section>
                    <q-item-label>{{ task.title }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn icon="delete" flat round dense color="red"
                      @click="openDeleteTaskDialog(column.id, task.id)" />
                  </q-item-section>
                </q-item>

                <q-item v-if="column.tasks.length === 0" class="kanban-empty-message">
                  <q-item-section>No tasks available.</q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <BaseDialog  v-model="showAddColumnDialog" title="Add New Column" message="Enter column name:" prompt
          promptType="text" promptLabel="Column Name" okButtonLabel="Add" :isDarkMode="true" @ok="handleAddColumn" />

        <BaseDialog  v-model="showAddTaskDialog" title="Add New Task" message="Enter task title:" prompt
          promptType="text" promptLabel="Task Title" okButtonLabel="Add" :isDarkMode="true" @ok="handleAddTask" />

        <BaseDialog  v-model="showDeleteColumnDialog" title="Delete Column"
          message="Are you sure you want to delete this column and all its tasks?" okButtonLabel="Delete"
          okButtonColor="negative" :isDarkMode="true" @ok="handleDeleteColumn" />

        <BaseDialog  v-model="showDeleteTaskDialog" title="Delete Task"
          message="Are you sure you want to delete this task?" okButtonLabel="Delete" okButtonColor="negative"
          :isDarkMode="true" @ok="handleDeleteTask" />
      </q-page>
    </QPageContainer>
  </QLayout>
</template>

<script setup>
import useWorkspacePage from './utils/app';
import BaseDialog from './components/‌BaseDialog.vue';
const {
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
} = useWorkspacePage();
</script>

<style>
@import './assets/css/app.css';
</style>