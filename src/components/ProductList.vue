<script setup lang="ts">
    import ProductCard from "../components/ProductCard.vue";
    import ProductDetails from "../components/ProductDetails.vue";
    import { ref, onMounted, nextTick } from "vue";
    import type { Ref } from "vue";
    import EmptyAddCard from "./EmptyAddCard.vue";
    import ProductEdit from "./ProductEdit.vue";

    const props = defineProps({
        shopId: String,
        editable: Boolean
    });

    // useRoute prende il parametro :shopId definito nella route
    const products: Ref<any[], any[]> = ref([]);
    const shopFound = ref(true);
    const detailsProductId = ref("");
    const modalRef: Ref<any> = ref(null);

    async function showDetails(productId: string) {
        detailsProductId.value = productId;
        await nextTick();
        modalRef.value?.open();
    }

    async function newElementDetails() {
        detailsProductId.value = "";
        await nextTick();
        modalRef.value?.open();
    }

    async function updateProducts() {
        products.value = await fetch(`${import.meta.env.VITE_BACKEND_URL_API}/shops/${props.shopId}/products`)
            .then((res) => { return res.json() })
            .catch(() => { shopFound.value = false });
    }

    onMounted(() => {
        updateProducts();
    });
</script>

<template>
    <div v-if="shopFound" class="mx-auto">
        <h1 class="text-3xl font-bold my-8">Prodotti</h1>
        <div class="grid grid-cols-4 gap-4">
            <!-- Pulsante per l'aggiunta di un nuovo prodotto -->
            <EmptyAddCard v-if="editable" @click="newElementDetails" />
            <!-- Prodotti  del negozio -->
            <ProductCard v-for="product in products" :shopId="shopId" :productId="product.id" :editable="editable" @showDetails="showDetails"/>
        </div> 
    </div>
    <!-- Popup visualizzazione -->
    <ProductDetails ref="modalRef" :shopId="shopId" :productId="detailsProductId" v-if="!editable" />
    <!-- Popup creazione -->
    <ProductEdit ref="modalRef" :onProductAdded="updateProducts" :shopId="shopId" :productId="detailsProductId"  v-if="editable" />
</template>