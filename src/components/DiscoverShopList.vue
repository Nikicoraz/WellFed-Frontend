<script setup lang="ts">
    import { ref, onMounted, type Ref } from "vue";
    import VueCookies from "vue-cookies";
    import { useI18n } from "vue-i18n";
    import ShopCard from "./ShopCard.vue";

    const cookies = (VueCookies as any);
    const backendAPI = import.meta.env.VITE_BACKEND_URL_API;
    const {t} = useI18n();

    const shops: Ref<any[], any[]> = ref([]);

    onMounted(async () => {
        shops.value = await fetch(`${backendAPI}/shops`)
          .then((res) => { return res.json(); })
          .then(async (json) => { 
                const copy = json.slice();
                const sampleSize = 10;
                for (let i = copy.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [copy[i], copy[j]] = [copy[j], copy[i]];
                }
                return copy.slice(0, sampleSize);
            });
    });
</script>

<template>
    <div class="flex flex-col p-8">
        <div class="flex flex-cols m-4">
            <!--icona-->
            <h1 class="text-2xl">Esplora negozi</h1>
        </div>
        <div class="grid grid-cols-3 gap-4">
            <ShopCard v-for="shop in shops" :key="shop"
                :shop="shop"
            />
        </div>
    </div>
</template>