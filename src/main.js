import { createApp } from 'vue';
import App from './App.vue';

import store from './store';


import { Quasar } from 'quasar';
import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';

import { QBtn, QCard, QLayout, QHeader, QToolbar, QPageContainer, QPage, QList, QItem, QItemSection, QItemLabel, Notify, Dialog, QDialog, QSpace, QInput, QCardActions, QCardSection, QCheckbox } from 'quasar';


const app = createApp(App);

app.use(store);

app.use(Quasar, {
  plugins: { Notify, Dialog },

  components: {
    QBtn, QCard, QLayout, QHeader, QToolbar, QPageContainer, QPage, QList, QItem, QItemSection, QItemLabel,
    QDialog,
    QSpace,
    QInput,
    QCardActions,
    QCardSection,
    QCheckbox
  },
});

app.mount('#app');