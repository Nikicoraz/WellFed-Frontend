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
            points: Number
        }]
    };
</script>

<script setup lang="ts">
    import { ref, watch, type Ref } from 'vue';
    import { useRoute, type RouteLocationNormalizedGeneric } from 'vue-router';
    import NavBar from '../components/NavBar.vue';

    const results: Ref<SearchResults | null> =  ref(null);
    const proxy = useRoute();

    function updateResults(proxy: RouteLocationNormalizedGeneric){
        const query = proxy.query.query;
        const filter = proxy.query.filter;
    
        fetch(import.meta.env.VITE_BACKEND_URL + "/search?query=" + query + "&filter=" + filter).then(e => e.json()).then(data => {
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
        <div v-if="results?.shops.length ?? 0 > 0" class="card bg-fed-bg brightness-95 rounded-box p-4 m-2">
            <h1 class="text-2xl">Shops</h1>
            <div>
                <div v-for="shop in results?.shops">
                    <p>{{ shop.name }}</p>
                </div>
            </div>
        </div>
        <div class="divider" v-if="(results?.shops.length ?? 0 > 0) && (results?.products.length ?? 0 > 0)"></div>
        <div v-if="results?.products.length ?? 0 > 0" class="card bg-fed-bg brightness-95 rounded-box p-4 m-2">
            <h1 class="text-2xl">Products</h1>
            <div>
                <div v-for="product in results?.products">
                    <p>{{ product.name }}</p>
                </div>
            </div>
        </div>
    </div>
</template>