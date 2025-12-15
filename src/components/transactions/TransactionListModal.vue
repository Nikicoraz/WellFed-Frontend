<script setup lang="ts">
    import { ref, watch, type Ref } from "vue";
    import VueCookies from "vue-cookies";
    import { useI18n } from "vue-i18n";
    import TransactionListEntry from "./TransactionListEntry.vue";

    const {t} = useI18n();

    const props = defineProps({
        open: Boolean
    });

    const emit = defineEmits(['close', 'showTransactionDetailsModal']);

    const transactionList: Ref<any> = ref<any>([]); // brutto
    const backendUrl = import.meta.env.VITE_BACKEND_URL_API;

    const dialog: Ref<HTMLDialogElement | null> = ref(null);

    async function fetchTransactions() {
        transactionList.value = await fetch(`${backendUrl}/transactions`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + (VueCookies as any).get("token")
            }
        }).then ((res) => {
            if (res.status == 200) {
                return res.json()
            } else {
                return [];
            }
        });
    }

    watch(() => props.open, async (open) => {
        if (!dialog.value) {
            return
        }

        if (open) {
            await fetchTransactions()
            dialog.value.showModal();
        } else {
            dialog.value.close();
        }
    });

    // Da fare l'interfaccia ma non so come farla dato il tipo delle api
</script>

<template>
    <dialog ref="dialog" class="modal">
        <div v-if="transactionList.length > 0" class="modal-box w-4/5 max-w-5xl">
            <ul class="list bg-base-100 rounded-box shadow-md">
                <!-- TODO mettere traduzioni -->
                <li class="p-4 pb-5 text-md">Ultime transazioni avvenute</li>
                <li v-for="transaction in transactionList">
                    <TransactionListEntry :transaction="transaction" @show-transaction-details-modal="(transaction) => { emit('showTransactionDetailsModal', transaction) }"/>
                </li>
            </ul>
            <div class="my-4 modal-action">
                <button class="btn" @click="$emit('close')">{{ `${t('button.chiudi')}` }}</button>
            </div>
        </div>
    </dialog>
</template>