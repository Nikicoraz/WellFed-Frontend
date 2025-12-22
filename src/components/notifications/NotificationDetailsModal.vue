<script setup lang="ts">
    import { ref, watch, type Ref } from "vue";
    import { useI18n } from "vue-i18n";
    import VueCookies from "vue-cookies";
    import { router } from '../../extensions/router';

    const {t} = useI18n();
    const backendAPI = import.meta.env.VITE_BACKEND_URL_API;
    const cookies = (VueCookies as any);

    const props = defineProps(['open', 'notification']);
    const emit = defineEmits(['close']);

    const dialog: Ref<HTMLDialogElement | null> = ref(null);
    const token = cookies.get("token");

    async function deleteNotification() {
        if (!props.notification) {
            return;
        }

        await fetch(`${backendAPI}/notifications/${props.notification.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        // Chiude il dialog dopo l'eliminazione
        emit('close');
    }

    function containsShopLink() {
        if (!props.notification || props.notification.shopLink !== null || props.notification.shopLink !== undefined) {
            return false;
        }

        return true;
    }

    function shopRedirect() {
        if (containsShopLink()) {
            router.push('/shop/' + props.notification.shopLink);
        }
    }

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

            dialog.value.showModal();
        } else {
            dialog.value.close();
        }
    });
</script>

<template>
    <dialog ref="dialog" class="modal" @close="$emit('close')">
        <div v-if="props.notification" class="modal-box">
            <div class="bg-white text-black flex flex-col gap-12">
                <div class="flex flex-col justify-between">
                    <div class="flex items-center text-3xl">{{ props.notification.title }}</div>
                    <div>{{ props.notification.notificationMessage }}</div>
                    <button class="btn mt-5 bg-lime-600 text-white" v-if="containsShopLink()" @click="shopRedirect()">{{ t('casellaNotifiche.redirectNegozio') }}</button>
                </div>
            </div>
            <div class="my-4 modal-action">
                <button class="btn mr-auto bg-red-700 text-white" @click="deleteNotification()">{{ t('casellaNotifiche.eliminaNotifica') }}</button>
                <form method="dialog">
                    <button class="btn">{{ t('button.chiudi') }}</button>
                </form>
            </div>
        </div>
    </dialog>
</template>