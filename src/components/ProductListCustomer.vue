<script setup lang="ts">
    import ProductCard from "../components/ProductCard.vue";
    import ProductDetails from "../components/ProductDetails.vue";
    import { ref, onMounted, nextTick } from "vue";
    import type { Ref } from "vue";
    const props = defineProps({
        shopId: String,
    });

    // useRoute prende il parametro :shopId definito nella route
    const products: Ref<any[], any[]> = ref([]);
    const shopFound = ref(true);
    const details = ref(false);
    const detailsProductId = ref("");
    const modalRef: Ref<any> = ref(null);

    async function showDetails(productId: string) {
        detailsProductId.value = productId;
        details.value = true;
        await nextTick();
        modalRef.value?.open();
    }

    onMounted(async () => {
        products.value = await fetch(`${import.meta.env.VITE_BACKEND_URL_API}/shops/${props.shopId}/products`)
            .then((res) => { return res.json() })
            .catch(() => { shopFound.value = false });
    });
</script>

<template>
    <div v-if="shopFound" class="mx-auto">
        <h1 class="text-3xl font-bold my-8">Prodotti</h1>
        <div class="grid grid-cols-4 gap-4">
            <ProductCard v-for="product in products" :shopId="shopId" :productId="product.id" @showDetails="showDetails"/>
        </div> 
    </div>
    <ProductDetails ref="modalRef" v-if="details" :shopId="shopId" :productId="detailsProductId"/>
</template>