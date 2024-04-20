import './assets/main.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'

import "vuetify/styles"
import '@mdi/font/css/materialdesignicons.css'
/*import {aliases, mdi} from "vuetify/iconsets"*/

import {autoAnimatePlugin} from "@formkit/auto-animate/vue"

import {createVuetify} from "vuetify";
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"

const myCustomLightTheme = {
    dark: false,
    colors: {
        background: '#FFF',
        surface: '#F3EDF7',
        'surface-bright': '#FFF',
        'surface-light': '#EEE',
        'surface-variant': '#424242',
        'on-surface-variant': '#EEE',
        primary: '#6750A4',
        'primary-darken-1': '#3723B0',
        secondary: '#f2df73',
        'secondary-darken-1': '#018786',
        error: '#B00020',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',
    },
    variables: {
        'another-surface': '#dfd9e4',
        'border-color': '#000000',
        'border-opacity': 0.12,
        'border-radius': '8px',
        'border-button-radius': '12px',
        'high-emphasis-opacity': 0.87,
        'medium-emphasis-opacity': 0.60,
        'disabled-opacity': 0.38,
        'idle-opacity': 0.04,
        'hover-opacity': 0.04,
        'focus-opacity': 0.12,
        'selected-opacity': 0.08,
        'activated-opacity': 0.12,
        'pressed-opacity': 0.12,
        'dragged-opacity': 0.08,
        'theme-kbd': '#212529',
        'theme-on-kbd': '#FFFFFF',
        'theme-code': '#F5F5F5',
        'theme-on-code': '#000000',
    }
}

const vuetify = createVuetify({
    components,
    directives,
    defaults: {
        VBtn: {
            variant: "flat",
            class: "font-weight-bold text-none",
            color: "primary"
        },
        VTextField: {
            variant:'outlined',
            hideDetails: true,
        },
        VRadioGroup: {
            hideDetails: true,
        },
        VCheckbox: {
            hideDetails: true,
        }

    },
    theme: {
        defaultTheme: "myCustomLightTheme",
        themes: {myCustomLightTheme}}
})

const app = createApp(App)

app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(autoAnimatePlugin)

app.mount('#app')
