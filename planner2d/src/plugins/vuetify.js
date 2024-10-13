import { createVuetify, useDisplay } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import colors from 'vuetify/util/colors';
import { ru } from 'vuetify/locale';
import { VBtn } from 'vuetify/components';
import { VDateInput, VNumberInput } from 'vuetify/labs/components';
import 'vuetify/dist/vuetify.min.css';

export default createVuetify({
    locale: {
        locale: 'ru',
        fallback: 'ru ',
        messages: { ru },
    },
    aliases: {
        VBtnCard: VBtn,
    },
    defaults: {
        VTextField: {
            variant: 'outlined',
            hideDetails: 'true',
            color: 'primary',
            density: 'compact',
            autocomplete: 'off',
            VField: {
                class: ['text-primary', 'text-caption', 'text-sm-subtitle-1'],
            },
        },
        VDialog: {
            elevation: 16,
            scrim: 'primary',
        },
        VDatePicker: {
            color: 'primary',
            class: ['text-subtitle-1', 'text-primary', 'scroll-container'],
        },
        // VList: {
        //     VListItem: {
        //         class: ['text-primary', 'px-2', 'px-sm-4'],
        //         VListItemTitle: {
        //             class: ['text-caption', 'text-sm-subtitle-1'],
        //         },
        //     },
        // },
        VBtnCard: {
            class: ['text-surface', 'bg-primary', 'text-caption', 'text-sm-button', 'text-uppercase'],
            variant: 'outlined',
        },
    },
    components: {
        VDateInput,
        VNumberInput,
    },
    theme: {
        defaultTheme: localStorage.getItem('theme') || 'light',
        themes: {
            light: {
                dark: false,
                colors: {
                    primary: '#232a59',
                    secondary: '#0b0d38',
                    background: colors.amber.lighten5,
                    surface: colors.amber.lighten4,
                    'surface-variant': colors.indigo.darken4,
                    error: '#d0733b',
                },
            },
            dark: {
                dark: true,
                colors: {
                    background: '#0b0d38',
                    surface: '#232a59',
                    'surface-variant': colors.amber.lighten4,
                    primary: colors.amber.lighten4,
                    secondary: colors.amber.lighten5,
                    error: '#d0733b',
                },
            },
        },
    },
    icons: {
        aliases,
        sets: {
            mdi,
        },
    },
    display: {
        mobileBreakpoint: 'md',
        thresholds: {
            xs: 0,
            sm: 420,
            md: 600,
            lg: 960,
            xl: 1280,
            xxl: 1920,
        },
    },
});
