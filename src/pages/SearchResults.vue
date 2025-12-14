<script lang="ts">
    interface SearchResults {
        shops: [{
            id: String,
            name: String,
            address: String,
            image: String
        }],
        products: [{
            id: String,
            name: String,
            description: String,
            origin: String,
            image: String,
            points: Number,
            shopID: String
        }]
    };
</script>

<script setup lang="ts">
    import { ref, watch, type Ref } from 'vue';
    import { useRoute, type RouteLocationNormalizedGeneric } from 'vue-router';
    import NavBar from '../components/NavBar.vue';
    import ShopSearchResult from '../components/ShopSearchResult.vue';
    import ProductSearchResult from '../components/ProductSearchResult.vue';
import QRScanner from '../components/QRScanner.vue';

    const results: Ref<SearchResults | null> = ref(null);
    const proxy = useRoute();

    function updateResults(proxy: RouteLocationNormalizedGeneric){
        const query = proxy.query.query;
        const filter = proxy.query.filter;
    
        fetch(import.meta.env.VITE_BACKEND_URL_API + "/search?query=" + query + "&filter=" + filter).then(e => e.json()).then(data => {
            results.value = data as SearchResults;
        });
    }

    watch(proxy, (proxy) => {
        updateResults(proxy);
    }, {deep: true})

    updateResults(proxy);

</script>

<template>
    <div class="min-h-screen bg-fed-bg">
        <NavBar />
        <div v-for="shop in results?.shops">
            <ShopSearchResult :shop="shop" />
        </div>
        <div v-for="product in results?.products">
            <ProductSearchResult :product="product" />
        </div>
        <QRScanner />
    </div>
</template>