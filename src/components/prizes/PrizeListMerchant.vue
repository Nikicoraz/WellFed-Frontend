<script setup lang="ts">
    import { onMounted, ref } from "vue";
    import type { Ref } from "vue";
    import EmptyAddCard from "./EmptyAddCard.vue";
    import PrizeEditModal from "./PrizeEditModal.vue";
    import PrizeCard from "./PrizeCard.vue";
    import PrizeDetailsModal from "./PrizeDetailsModal.vue";
    import ProductInsertModal from "./PrizeInsertModal.vue";
    import QRPopup from "../QRPopup.vue";
    import Alert from "../util/Alert.vue";
    
    const backendAPI = import.meta.env.VITE_BACKEND_URL_API;

    const props = defineProps({
        shopId: String,
    });

    // useRoute prende il parametro :shopId definito nella route
    const shopFound = ref(true);

    const prizes: Ref<any[], any[]> = ref([]);

    const displayedQRCode = ref("");

    // Dettagli
    const showPrizeDetails = ref(false);
    const prizeDetails = ref(null);

    // Inserimento
    const showInsertNewPrize = ref(false);

    // Modifica
    const showEditPrize = ref(false);
    const editedPrizeId = ref("");

    function showDetails(product: any) {
        prizeDetails.value = product;
        showPrizeDetails.value = true;
    }

    async function refreshPrizes() {
        prizes.value = await fetch(`${backendAPI}/shops/${props.shopId}/prizes`)
            .then((res) => { return res.json() })
            .catch(() => { shopFound.value = false });
    }

    onMounted(async () => {
        await refreshPrizes();
    });
</script>

<template>
    <div v-if="shopFound" class="mx-auto">
        <h1 class="text-3xl font-bold my-8">{{ $t('shop.premi') }}</h1>
        <div class="grid grid-cols-4 gap-4">
            <!-- Pulsante per l'aggiunta di un nuovo prodotto -->
            <EmptyAddCard @click="() => { showInsertNewPrize = true; }" />
            <!-- Prodotti  del negozio -->
            <div v-for="prize in prizes" :key="prize.id">
                <PrizeCard 
                    :prize="prize" 
                    :editable="true"
                    @showDetails="showDetails"
                    @edit="(productId) => { 
                        editedPrizeId = productId;
                        showEditPrize = true;
                    }"
                />
            </div>
        </div> 
    </div>
    <PrizeDetailsModal 
        :open="showPrizeDetails" 
        :prizeDetails="prizeDetails" 
        @close="showPrizeDetails = false"
    />
    <ProductInsertModal
        :shopId="shopId" 
        :open="showInsertNewPrize"
        @close="showInsertNewPrize = false"
        @prize-saved="refreshPrizes"
    />
    <PrizeEditModal 
        :shopId="shopId" 
        :prizeID="editedPrizeId"
        :open="showEditPrize"
        @close="showEditPrize = false"
        @prize-saved="refreshPrizes"
    />
    <Alert ref="alert"/>
    <QRPopup :qrcode="displayedQRCode"/>
</template>