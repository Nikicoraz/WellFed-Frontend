<script setup lang="ts">
    import { ref, watch } from "vue";
    import type { Ref } from "vue";
    import { useI18n } from "vue-i18n";

    const {t} = useI18n();
    const backendUrl = ref(import.meta.env.VITE_BACKEND_URL);

    const props = defineProps(['open', 'productDetails']);
    const emit = defineEmits(['close']);

    const dialog: Ref<HTMLDialogElement | null> = ref(null); 

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
        <div v-if="props.productDetails" class="modal-box">
            <div class="flex flex-cols my-4">
                <div class="flex-1 h-full flex flex-col">
                    <h2 class="text-3xl font-bold">{{ props.productDetails.name }}</h2>
                    <img
                        class="w-full h-full object-cover rounded-xl"
                        :src="`${backendUrl}${props.productDetails.image}`"
                        :alt="props.productDetails.name"
                    />
                    <ul class="py-4">
                        <li class="text-xl">{{ `${t('product.descrizione')}: ${props.productDetails.description}` }}</li>
                        <li class="text-xl">{{ `${t('product.origine')}: ${props.productDetails.origin}` }}</li>
                        <li class="text-xl">{{ `${t('product.punti')}: ${props.productDetails.points}` }}</li>
                    </ul>
                </div>
            </div>
            <div class="my-4 modal-action">
                <form method="dialog">
                    <button class="btn">{{ `${t('button.chiudi')}` }}</button>
                </form>
            </div>
        </div>
    </dialog>
</template>