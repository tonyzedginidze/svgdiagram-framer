import { createApp } from 'vue';
import { framer } from '@framer/plugin';
import '@framer/plugin/framer.css';
import App from './App.vue';
import './obsidian.css';
import './style.css';
import { insertDiagram } from './insert.js';
import { service } from './service.js';

await framer.showUI({ position: 'center', width: 640, height: 720, resizable: true, minWidth: 320, minHeight: 360 });
createApp(App, {
  target: 'Insert a diagram into the current canvas',
  insertLabel: 'Insert into Framer',
  privacyText: 'No Framer project content is sent.',
  service,
  insert: async diagram => { await insertDiagram(framer, diagram); framer.notify('Diagram inserted into the canvas.', { variant: 'success' }); }
}).mount('#app');
