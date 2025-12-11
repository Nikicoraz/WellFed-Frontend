<script lang="ts">
    export interface SearchResults {
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
        router.push("/search?query=" + searchQuery.value + "&filter=" + getFilterAPITranslation(filter.value));

        // fetch(import.meta.env.VITE_BACKEND_URL + "/search?query=" + searchQuery.value).then(e => e.json()).then(data => {
        //     const results = data as SearchResults;
        //     console.log(results.products);
        // })
    }
</script>

<template>
    <div class="navbar bg-fed-green shadow-sm">
        <div class="navbar-start">
            <WellfedLogo />
        </div>
        <div class="navbar-center">
            <input type="text" class="input w-3xl" placeholder="Search" @keypress.enter="search" v-model="searchQuery">
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