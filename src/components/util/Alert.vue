<script setup lang="ts">
    import AlertType from "../../types/alert";
    import { ref } from "vue";

    const visible = ref(false);
    const duration = 5000;
    const alertType = ref(AlertType.Info);
    const message = ref("");
    let lastTimeout: number | undefined = undefined;

    function showAlert(type: AlertType, msg: string) {
        showAlertWithDuration(type, msg, duration);
    }

    function showAlertWithDuration(type: AlertType, msg: string, duration: number) {
        visible.value = true;
        alertType.value = type;
        message.value = msg;

        if(lastTimeout) {
            clearTimeout(lastTimeout);
        }

        lastTimeout = setTimeout(() => {
            visible.value = false;
        }, duration);
    }

    defineExpose({ showAlert, showAlertWithDuration });
</script>

<template>
    <Transition>
        <div v-if="visible">
            <div class="fixed left-1/2 -translate-x-1/2 bottom-10 alert alert-soft transition-all duration-300 z-30" :class="alertType?.toString()">{{ message }}</div>
        </div>
    </Transition>
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