<script setup lang="ts">
    import { ref, onMounted, type Ref } from "vue";
    import VueCookies from "vue-cookies";
    import { useI18n } from "vue-i18n";
    import ShopCard from "ShopCard.vue";

    const cookies = (VueCookies as any);
    const backendAPI = import.meta.env.VITE_BACKEND_URL_API;
    const {t} = useI18n();

    const pointsMappings: Ref<any[], any[]> = ref([]);

    onMounted(async () => {
        pointsMappings.value = await fetch(`${backendAPI}/client`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + cookies.get("token")
            }
        }).then((res) => { return res.json(); })
          .then(async (json) => { 
            const entries = Object.entries(json.points ?? {});
            const resolved = await Promise.all(
                entries.map(async ([shopId, points]) => {
                    const shop = await fetch(`${backendAPI}/shop/${shopId}`)
                        .then(res => res.json());

                    return [shop, points];
                })
            );

            return resolved;
        });
    });
</script>

<template>
    <div>
        <div class="flex">
            <!--icona-->
            <h1>Punti disponibili</h1>
        </div>
        <div class="grid grid-cols-4 gap-4">
            <ShopCard v-for="([shop, points]) in pointsMappings" :key="shop"
                :shop="shop"
                :points="points"
            />
        </div>
    </div>
</template>