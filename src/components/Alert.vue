<script lang="ts">
    export enum AlertType {
        Success = 'alert-success',
        Info = 'alert-info',
        Warning = 'alert-warning',
        Error = 'alert-error'
    }

    export function showError(visibility: Ref<boolean, boolean>, duration: number){
        visibility.value = true;

        setTimeout(() =>{
            visibility.value = false;
        }, duration);
    }
</script>

<script setup lang="ts">
    import type { PropType, Ref } from 'vue';

    const props = defineProps({
        alertType: String as PropType<AlertType>,
        message: String
    });
</script>

<template>
    <div class="fixed left-1/2 -translate-x-1/2 bottom-10 alert alert-soft transition-all duration-300" :class="alertType?.toString()">{{ message }}</div>
</template>

<style scoped>
    /* Se si wrappa l'alert in un <Transition></Transition> allora quando appare/scompare verranno applicate queste proprietà */
    .v-enter-active,
    .v-leave-active {
        transition: opacity 0.5s ease;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }
</style>