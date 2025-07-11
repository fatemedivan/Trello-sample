<template>
    <q-item class="q-my-sm q-py-sm kanban-task-item">
        <q-item-section>
            <q-item-label>{{ title }}</q-item-label>
        </q-item-section>
        <q-item-section side>
            <q-btn icon="delete" flat round dense color="red" @click="openDeleteTaskDialog(columnId, taskId)" />
        </q-item-section>
    </q-item>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
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
    }
});
</script>