<script setup lang="ts">
import { ref, watch } from 'vue';

    const props = defineProps<{
        qrcode: string
    }>()

    const dialog = ref<HTMLDialogElement | null>(null);

    // Quando viene aggi
    watch(() => props.qrcode, () => {
        dialog.value!.showModal();
    });
</script>

<template>
    <dialog class="modal" ref="dialog">
    <div class="modal-box flex justify-center flex-col">
        <img :src="qrcode" alt="">
        <p class="py-4">{{ $t("shop.qrcode.mostraACliente") }}</p>
        <div class="modal-action">
            <form method="dialog">
                <button class="btn">{{ $t("button.chiudi") }}</button>
            </form>
        </div>
    </div>
    </dialog>
</template>