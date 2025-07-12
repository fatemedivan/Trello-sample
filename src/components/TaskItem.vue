<template>
    <q-item class="q-my-sm q-py-sm kanban-task-item" :draggable="true" @dragstart="onDragStart">
        <q-item-section>
            <q-item-label>{{ title }}</q-item-label>
        </q-item-section>
        <q-item-section side>
            <div class="flex" >
                <q-btn v-if="allowEditTask" icon="edit" flat round dense color="red"
                    @click="openEditeTaskDialog(columnId, taskId)" />
                <q-btn v-if="allowDeleteTask" icon="delete" flat round dense color="red"
                    @click="openDeleteTaskDialog(columnId, taskId)" />
            </div>
        </q-item-section>
    </q-item>
</template>

<script setup>

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    columnId: {
        type: [String, Number],
        required: true
    },
    taskId: {
        type: [String, Number],
        required: true
    },
    openDeleteTaskDialog: {
        type: Function,
        required: true
    },
    openEditeTaskDialog: {
        type: Function
    },
    allowDeleteTask: {
        type: Boolean,
        default: false
    },
    allowEditTask: {
        type: Boolean,
        default: false
    },
    
});
const emit = defineEmits(['task-drag-start']);
const onDragStart = (event) => {
  const payload = {
    columnId: props.columnId,
    taskId: props.taskId,
  };
  emit('task-drag-start', payload);

  event.dataTransfer.effectAllowed = 'move'; 
};
</script>