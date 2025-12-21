<script setup lang="ts">
    import { ref, toRaw, nextTick, watch, type Ref } from "vue";
    import { useI18n } from "vue-i18n";
    import VueCookies from "vue-cookies";

    const {t} = useI18n();
    const backendAPI = import.meta.env.VITE_BACKEND_URL_API;
    const cookies = (VueCookies as any);

    const props = defineProps(['open', 'transaction']);
    const emit = defineEmits(['close']);

    const dialog: Ref<HTMLDialogElement | null> = ref(null);

    const merchantName = ref("");
    const clientName = ref("");
    const productInfo: Ref<any> = ref([]);
    const prizeInfo: Ref<any> = ref([]);

    const date = ref("");
    const hour = ref("");

    const type = ref("");

    watch(() => props.transaction, async (newTransaction) => {
        const products = [];
        const prizes = [];

        if (!newTransaction) {
            return;
        }
        
        date.value = new Date(props.transaction.issuingDate).toLocaleDateString();
        hour.value = new Date(props.transaction.issuingDate).toLocaleTimeString();

        switch (props.transaction.transactionType) {
            case "Point Assignment":
                type.value = t("cronologiaTransazioni.tipo.assegnamentoPunti");
                break;

            case "Prize Redeem":
                type.value = t("cronologiaTransazioni.tipo.riscossionePremio");
                break;

            default:
                break;
        }

        const rawItems = toRaw(newTransaction.items);

        for (let productItem of rawItems.products) {
            products.push({
                id: productItem.product,
                quantity: productItem.quantity
            });
        }

        for (let prizeItem of rawItems.prizes) {
            prizes.push({
                id: prizeItem.prize
            });
        }

        const issuer = {
            id: newTransaction.issuerID.id,
            type: newTransaction.issuerID.type
        };

        const receiver = {
            id: newTransaction.receiverID.id,
            type: newTransaction.receiverID.type
        };

        const token = cookies.get("token");
        clientName.value = await fetch(`${backendAPI}/client`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then((res) => { return res.json() })
        .then((client) => { return client.username });

        const merchantId = issuer.type == 'merchant' ? issuer.id : receiver.id;

        merchantName.value = await fetch(`${backendAPI}/shops/${merchantId}`)
            .then((res) => { return res.json() })
            .then((shop) => { return shop.name });

        productInfo.value = await Promise.all(products.map(async (product) => {
            const productJSON = await fetch(`${backendAPI}/shops/${merchantId}/products/${product.id}`)
                    .then((res) => { return res.json(); });
            return {
                name: productJSON.name,
                points: productJSON.points, 
                quantity: product.quantity
            }
        }));

        prizeInfo.value = await Promise.all(prizes.map(async (prize) => {
            const prizeJSON = await fetch(`${backendAPI}/shops/${merchantId}/prizes/${prize.id}`)
                    .then((res) => { return res.json(); });
            return {
                name: prizeJSON.name,
                points: prizeJSON.points
            }
        }));

    }, { immediate: true, deep: true });

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
        <div v-if="transaction" class="modal-box">
            <div class="bg-white text-black flex flex-col gap-12">
                <div class="flex flex-row justify-between">
                    <div class="flex items-center text-3xl">{{ type }}</div>
                    <div class="flex items-center text-lg bg-lime-700 text-white border rounded-lg p-3 aspect-square text-center">{{ props.transaction.points }}</div>
                </div>
                <div class="flex flex-col justify-between">
                    <div>{{ `${t("cronologiaTransazioni.data")}: ${date}` }}</div>
                    <div>{{ `${t("cronologiaTransazioni.ora")}: ${hour}` }}</div>
                    <div>{{ `${t("cronologiaTransazioni.cliente")}: ${clientName}` }}</div>
                    <div>{{ `${t("cronologiaTransazioni.commerciante")}: ${merchantName}` }}</div>
                </div>
                <div>
                    <ul v-if="productInfo.length > 0">
                        <p class="text-xl">{{ t("cronologiaTransazioni.prodotti.header") }}</p>
                        <div class="overflow-x-auto">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>{{ t("cronologiaTransazioni.prodotti.tabella.nome") }}</th>
                                        <th>{{ t("cronologiaTransazioni.prodotti.tabella.quantita") }}</th>
                                        <th>{{ t("cronologiaTransazioni.prodotti.tabella.puntiPerUnita") }}</th>
                                        <th>{{ t("cronologiaTransazioni.prodotti.tabella.puntiTotali") }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="product in productInfo">
                                        <td>{{ product.name }}</td>
                                        <td>{{ product.quantity }}</td>
                                        <td>{{ product.points }}</td>
                                        <td>{{ product.quantity * product.points }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </ul>
                    <ul v-if="prizeInfo.length > 0">
                        <p class="text.xl">{{ t("cronologiaTransazioni.premi.header") }}</p>
                        <div class="overflow-x-auto">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>{{ t("cronologiaTransazioni.premi.tabella.nome") }}</th>
                                        <th>{{ t("cronologiaTransazioni.premi.tabella.punti") }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="prize in prizeInfo">
                                        <td>{{ prize.name }}</td>
                                        <td>{{ prize.points }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </ul>
                </div>
            </div>
            <div class="my-4 modal-action">
                <button class="btn" @click="$emit('close')">{{ `${t('button.chiudi')}` }}</button>
            </div>
        </div>
    </dialog>
</template>