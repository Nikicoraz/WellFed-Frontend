<script setup lang="ts">
    import { ref, nextTick, watch, type Ref } from "vue";
    import VueCookies from "vue-cookies";
    import { useI18n } from "vue-i18n";
    import TransactionListEntry from "./TransactionListEntry.vue";
    import TransactionDetailsModal from "./TransactionDetailsModal.vue";

    const {t} = useI18n();

    const props = defineProps({
        open: Boolean
    });

    const emit = defineEmits(['close']);

    const transactionList: Ref<any> = ref<any>([]); // brutto
    const backendAPI = import.meta.env.VITE_BACKEND_URL_API;

    const dialog: Ref<HTMLDialogElement | null> = ref(null);

    async function fetchTransactions() {
        transactionList.value = await fetch(`${backendAPI}/transactions`, {
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
            await fetchTransactions();
            await nextTick();
            dialog.value.showModal();
        } else {
            dialog.value.close();
        }
    });

    // Da fare l'interfaccia ma non so come farla dato il tipo delle api
    const showTransactionDetailsModal = ref(false);
    const selectedTransaction = ref(null);
</script>

<template>
    <dialog ref="dialog" class="modal">
        <div class="modal-box w-4/5 max-w-3xl">
            <div v-if="transactionList.length > 0">
                <p class="p-4 pb-5 text-xl text-black">{{ t("cronologiaTransazioni.header") }}</p>
                <ul class="list bg-base-100 rounded-box shadow-md">
                    <li v-for="transaction in transactionList">
                        <TransactionListEntry 
                            :transaction="transaction" 
                            @show-transaction-details="(transaction) => {
                                selectedTransaction = transaction;
                                showTransactionDetailsModal = true;
                            }"
                        />
                    </li>
                </ul>
            </div>
            <div v-else>
                <p class="text-black">{{ t("cronologiaTransazioni.nessunaTransazione") }}</p>
            </div>
            <div class="my-4 modal-action">
                <button class="btn" @click="$emit('close')">{{ `${t('button.chiudi')}` }}</button>
            </div>
        </div>
    </dialog>
    <TransactionDetailsModal 
        :open="showTransactionDetailsModal" 
        :transaction="selectedTransaction"
        @close="showTransactionDetailsModal = false" 
    />
</template>