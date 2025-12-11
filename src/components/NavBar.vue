<script lang="ts">
    enum SearchFilter {
        None = "Filters",
        Shops = "Shops only",
        Products = "Products only"
    }

    function getFilterAPITranslation(filter: SearchFilter): string {
        switch (filter) {
            case SearchFilter.None:
                return "";
            case SearchFilter.Products:
                return "products";
            case SearchFilter.Shops:
                return "shops";
        }
    }
</script>

<script setup lang="ts">
    import { ref } from 'vue';
    import VueCookies from 'vue-cookies';
    import WellfedLogo from './WellfedLogo.vue';
    import { router } from '../extensions/router';

    const username = ref("");
    const searchQuery = ref("");
    const filter = ref(SearchFilter.None);

    fetch(import.meta.env.VITE_BACKEND_URL + "/client", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + (VueCookies as any).get("token")
        }
    }).then(e => {
        if (e.status == 200){
            e.json().then(data =>{
                username.value = data.username;
            })
        }
    });

    function search() {
        // Solo redirect alla pagina di search
        router.push({
            path: "/search",
            query: {
                query: searchQuery.value,
                filter: getFilterAPITranslation(filter.value)
            }
        });

 
    }
</script>

<template>
    <div class="navbar bg-fed-green shadow-sm">
        <div class="navbar-start z-0">
            <span class="cursor-pointer z-10 flex items-center" @click="router.push('/')">
                <WellfedLogo />
            </span>
        </div>
        <div class="navbar-center">
            <input type="text" class="input w-[40dvw]" placeholder="Search" @keypress.enter="search" v-model="searchQuery">
            <div class="dropdown">
                <div tabindex="0" role="button" class="btn m-1">{{ filter.toString() }}</div>
                <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                    <li @click="filter = SearchFilter.None"><a>None</a></li>
                    <li @click="filter = SearchFilter.Shops"><a>{{ SearchFilter.Shops }}</a></li>
                    <li @click="filter = SearchFilter.Products"><a>{{ SearchFilter.Products }}</a></li>
                </ul>
                </div>
            </div>
        <div class="navbar-end text-white">
            <p>{{ username }}</p>
        </div>
    </div>
</template>