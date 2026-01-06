<script setup lang="ts">
    import { ref, watch } from "vue";
    import type { Ref } from "vue";
    import { useI18n } from "vue-i18n";
    import ConfirmModal from "../util/ConfirmModal.vue";
    import SafeImage from "../SafeImage.vue";

    const {t} = useI18n();
    const backendUrl = ref(import.meta.env.VITE_BACKEND_URL);

    const props = defineProps(['open', 'prizeDetails', 'client']);
    const emit = defineEmits(['close', 'generate-qr']);

    const dialog: Ref<HTMLDialogElement | null> = ref(null); 
    const confirm = ref<typeof ConfirmModal | null>(null);

    watch(() => props.open, async (open) => {
        if (!dialog.value) {
            return
        }

        if (open) {
            dialog.value.showModal();
        } else {
            dialog.value.close();
        }
    });
</script>

<template>
    <dialog ref="dialog" class="modal" @close="$emit('close')">
        <div v-if="props.prizeDetails" class="modal-box">
            <div class="flex flex-cols my-4">
                <div class="flex-1 h-full flex flex-col">
                    <h2 class="text-3xl font-bold">{{ props.prizeDetails.name }}</h2>
                    <SafeImage
                        class="w-full h-full object-cover rounded-xl"
                        :src="`${backendUrl}${props.prizeDetails.image}`"
                        :alt="props.prizeDetails.name"
                    />
                    <ul class="py-4">
                        <li class="text-xl">{{ `${t('product.descrizione')}: ${props.prizeDetails.description}` }}</li>
                        <li class="text-xl">{{ `${t('product.punti')}: ${props.prizeDetails.points}` }}</li>
                    </ul>
                </div>
            </div>
            <div class="my-4 modal-action">
                <button class="btn bg-lime-600 mr-auto text-white" @click="confirm!.ask($t('shop.premio.confermaRiscatto'))" v-if="client">
                    {{ $t('shop.premio.riscatta') }}
                </button>
                <form method="dialog">
                    <button class="btn">{{ $t('button.chiudi') }}</button>
                </form>
            </div>
        </div>
        <ConfirmModal ref="confirm" yes-styling="bg-lime-700 text-white" @on-yes="$emit('generate-qr', props.prizeDetails.id); dialog?.close();" />
    </dialog>
</template>
