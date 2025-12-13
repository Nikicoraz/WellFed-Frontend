<script setup lang="ts">
    import { ref } from 'vue';

    const dialog = ref<HTMLDialogElement | null>(null);
    const emits = defineEmits(['onYes', 'onNo']);
    const displayMessage = ref("");

    function ask(message: string) {
        displayMessage.value = message;
        dialog.value?.showModal();
    }

    defineExpose({ask});
</script>

<template>
    <dialog class="modal" ref="dialog">
    <div class="modal-box">
        <h3 class="text-lg font-bold">{{ displayMessage }}</h3>
        <div class="modal-action">
        <form method="dialog" class="flex justify-between gap-2">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn yes-btn" @click="$emit('onYes')">{{ $t("shop.conferma") }}</button>
            <button class="btn no-btn" @click="$emit('onNo')">{{ $t("shop.annulla") }}</button>
        </form>
        </div>
    </div>
    </dialog>
</template>