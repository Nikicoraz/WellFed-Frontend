<script setup lang="ts">
    import { ref, toRaw, nextTick, watch, type Ref } from "vue";
    import { useI18n } from "vue-i18n";

    const {t} = useI18n();
    const backendAPI = import.meta.env.VITE_BACKEND_URL_API;

    const props = defineProps(['open', 'transaction']);
    const emit = defineEmits(['close']);

    const dialog: Ref<HTMLDialogElement | null> = ref(null);

    const shopName = ref("");
    const productInfo: Ref<any> = ref([]);
    const prizeInfo: Ref<any> = ref([]);

    watch(() => props.transaction, async (newTransaction) => {
        const products = [];
        const prizes = [];

        if (!newTransaction) {
            return;
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

        const merchantId = issuer.type == 'merchant' ? issuer.id : receiver.id;
        shopName.value = await fetch(`${backendAPI}/shops/${merchantId}`)
            .then((res) => { return res.json() })
            .then((shop) => { return shop.name });

        productInfo.value = await Promise.all(products.map(async (product) => {
            return {
                name: await fetch(`${backendAPI}/shops/${merchantId}/products/${product.id}`)
                    .then((res) => { return res.json(); })
                    .then((p) => { return p.name; }),
                quantity: product.quantity
            }
        }));

        prizeInfo.value = await Promise.all(prizes.map(async (prize) => {
            return {
                name: await fetch(`${backendAPI}/shops/${merchantId}/prizes/${prize.id}`)
                    .then((res) => { return res.json(); })
                    .then((p) => { return p.name; })
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
            <div class="bg-white text-black flex flex-col">
                <div>{{ props.transaction.transactionType }}</div>
                <div>{{ props.transaction.transactionStatus }}</div>
                <div>{{ props.transaction.points}}</div>
                <div>
                    <ul v-if="productInfo.length > 0">
                        <p>Prodotti coinvolti</p>
                        <div class="overflow-x-auto">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="product in productInfo">
                                        <td>{{ product.name }}</td>
                                        <td>{{ product.quantity }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </ul>
                    <ul v-if="prizeInfo.length > 0" class="list rounded-xl shadow-md">
                        <p>Premi coinvolti</p>
                        <li v-for="prize in prizeInfo" class="list-row" >
                            {{ prize.name }}
                        </li>
                    </ul>
                </div>
            </div>
            <div class="my-4 modal-action">
                <button class="btn" @click="$emit('close')">{{ `${t('button.chiudi')}` }}</button>
            </div>
        </div>
    </dialog>
</template>