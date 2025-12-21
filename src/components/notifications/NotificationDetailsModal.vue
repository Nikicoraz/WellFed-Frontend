<script setup lang="ts">
    import { ref, toRaw, watch, type Ref } from "vue";
    import { useI18n } from "vue-i18n";
    import VueCookies from "vue-cookies";

    const {t} = useI18n();
    const backendAPI = import.meta.env.VITE_BACKEND_URL_API;
    const cookies = (VueCookies as any);

    const props = defineProps(['open', 'notification']);
    const emit = defineEmits(['close', 'readStatusChanged']);

    const dialog: Ref<HTMLDialogElement | null> = ref(null);
    const token = cookies.get("token");

    watch(() => props.open, async (open) => {
        if (!dialog.value) {
            return
        }

        if (open) {
            // Notifica segnata come letta una volta aperta
            await fetch(`${backendAPI}/notifications/${props.notification.id}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            emit("readStatusChanged");

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