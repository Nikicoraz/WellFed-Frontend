<script setup lang="ts">
    import { ref, toRaw, watch, type Ref } from "vue";
    import { useI18n } from "vue-i18n";

    const {t} = useI18n();

    const props = defineProps(['open', 'notification']);
    const emit = defineEmits(['close']);

    const dialog: Ref<HTMLDialogElement | null> = ref(null);

    const merchantName = ref("");
    const clientName = ref("");

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
    <dialog ref="dialog" class="modal">
        <div v-if="props.notification" class="modal-box">
            <div class="bg-white text-black flex flex-col gap-12">
                <div class="flex flex-col justify-between">
                    <div class="flex items-center text-3xl">{{ props.notification.title }}</div>
                    <div>{{ props.notification.notificationMessage }}</div>
                    <div>{{ props.notification.viewed }}</div>
                    <div>{{ props.notification.shopLink }}</div>
                </div>
            </div>
            <div class="my-4 modal-action">
                <button class="btn" @click="$emit('close')">{{ `${t('button.chiudi')}` }}</button>
            </div>
        </div>
    </dialog>
</template>