<template>
  <q-dialog v-model="internalModel" persistent>
    <q-card :class="['q-pa-md', darkModeClass]">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="cancelDialog" />
      </q-card-section>

      <q-card-section class="q-pt-sm">
        <div>{{ message }}</div>

        <q-input v-if="prompt" v-model="inputValue" :type="promptType" :label="promptLabel" outlined dense autofocus
          @keyup.enter="confirmDialog" :dark="isDarkMode" />

        <q-checkbox v-model="allowDeleteTask" v-if="showDeleteTaskCheckBox" label="Allow task deleting"
          :dark="isDarkMode" color="primary" class="q-mt-sm" />
        <q-checkbox v-model="allowEditTask" v-if="showEditTaskCheckBox" label="Allow task editing" :dark="isDarkMode"
          color="primary" class="q-mt-sm" />

        <q-checkbox v-model="allowDeleteColumn" v-if="showDeleteColumnCheckBox" label="Allow column deleting"
          :dark="isDarkMode" color="primary" class="q-mt-sm" />
        <q-checkbox v-model="allowEditColumn" v-if="showEditColumnCheckBox" label="Allow column editing"
          :dark="isDarkMode" color="primary" class="q-mt-sm" />

      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="cancelButtonLabel" :color="cancelButtonColor" @click="cancelDialog" />
        <q-btn :label="okButtonLabel" :color="okButtonColor" @click="confirmDialog" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: '',
  },
  prompt: {
    type: Boolean,
    default: false,
  },
  promptType: {
    type: String,
    default: 'text',
  },
  promptLabel: {
    type: String,
    default: 'Enter value',
  },
  cancelButtonLabel: {
    type: String,
    default: 'Cancel',
  },
  cancelButtonColor: {
    type: String,
    default: 'grey',
  },
  okButtonLabel: {
    type: String,
    default: 'OK',
  },
  okButtonColor: {
    type: String,
    default: 'primary',
  },
  isDarkMode: {
    type: Boolean,
    default: false,
  },
  showDeleteTaskCheckBox: {
    type: Boolean,
    default: false
  },
  showEditTaskCheckBox: {
    type: Boolean,
    default: false
  },
  showDeleteColumnCheckBox: {
    type: Boolean,
    default: false
  },
  showEditColumnCheckBox: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'ok', 'cancel']);

const internalModel = ref(props.modelValue);
const inputValue = ref('');
const allowDeleteTask = ref(false)
const allowEditTask = ref(false)
const allowDeleteColumn = ref(false);
const allowEditColumn = ref(false);

watch(() => props.modelValue, (newVal) => {
  internalModel.value = newVal;
});

const darkModeClass = computed(() => {
  return props.isDarkMode ? 'dark-mode-card' : '';
});

const confirmDialog = () => {
  emit('update:modelValue', false);
  emit('ok', {
    inputValue: inputValue.value,
    allowDeleteTask: allowDeleteTask.value,
    allowEditTask: allowEditTask.value,
    allowDeleteColumn: allowDeleteColumn.value,
    allowEditColumn: allowEditColumn.value
  });
  resetInputs()
};

const cancelDialog = () => {
  emit('update:modelValue', false);
  emit('cancel');
  resetInputs()
};
const resetInputs = () => {
  internalModel.value = false
  inputValue.value = ''
  allowDeleteTask.value = false
  allowEditTask.value = false
  allowDeleteColumn.value = false
  allowEditColumn.value = false
}
</script>

<style scoped>
.dark-mode-card {
  background-color: #1e1e1e !important;
  color: #e0e0e0 !important;
  width: 300px;
}

.dark-mode-card .q-field__native,
.dark-mode-card .q-field__label {
  color: #e0e0e0 !important;
}
</style>