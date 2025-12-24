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
          .then((json) => { return Object.entries(json.points ?? {}); });
    });
</script>

<template>
    <div>
        <div class="flex">
            <!--icona-->
            <h1>Punti disponibili</h1>
        </div>
        <div class="grid grid-cols-4 gap-4">
            <ShopCard v-for="([shopId, points]) in pointsMappings" :key="shopId"
                :shopId="shopId"
                :points="points"
            />
        </div>
    </div>
</template>