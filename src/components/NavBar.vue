<script lang="ts">

    enum SearchFilter {
        None,
        Shops,
        Products
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
    import { useI18n } from "vue-i18n";
    import { ref, type Ref } from 'vue';
    import VueCookies from 'vue-cookies';
    import WellfedLogo from './util/WellfedLogo.vue';
    import { router } from '../extensions/router';
    import TransactionListButton from "./transactions/TransactionListButton.vue";
    import NotificationListButton from "./notifications/NotificationListButton.vue";

    const {t} = useI18n();

    const username = ref("");
    const searchQuery = ref("");
    const filter = ref(SearchFilter.None);
    const searchHistory: Ref<string[]> = ref([]);
    const searchBar = ref<HTMLInputElement | null>(null);
    let showHistory = ref(false);

    // Get the client search history
    searchHistory.value = JSON.parse(localStorage.getItem("searchHistory") ?? "[]");

    // Get the client username to display
    fetch(import.meta.env.VITE_BACKEND_URL_API + "/client", {
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

    function getFilterName(filter: SearchFilter): string {
        switch (filter) {
            case SearchFilter.None:
                return t("ricerca.filtri.nome");
            case SearchFilter.Products:
                return t("ricerca.filtri.prodotti");
            case SearchFilter.Shops:
                return t("ricerca.filtri.negozi");
        }
    }

    function search() {
        if(searchQuery.value == ""){
            return;
        }

        if(searchHistory.value.length > 10) {
            searchHistory.value.splice(0, 1);
        }

        if(!searchHistory.value.includes(searchQuery.value)){
            searchHistory.value.push(searchQuery.value);
            localStorage.setItem("searchHistory", JSON.stringify(searchHistory.value));
        }

        // Solo redirect alla pagina di search + salvataggio nella cronologia
        router.push({
            path: "/search",
            query: {
                query: searchQuery.value,
                filter: getFilterAPITranslation(filter.value)
            }
        });
    }

    const emit = defineEmits(['showTransactionListModal']);
</script>

<template>
    <div class="navbar bg-fed-green shadow-sm">
        <div class="navbar-start z-0">
            <span class="cursor-pointer z-10 flex items-center" @click="router.push('/')">
                <WellfedLogo />
            </span>
        </div>
        <div class="navbar-center">
            <!-- Search bar -->
            <div class="search-wrapper" @focusin="showHistory = true" @focusout="showHistory = false">
                <input type="text" class="input w-[40dvw]" :placeholder="$t('ricerca.cerca')" @keypress.enter="showHistory = false; search()" @input="showHistory = true" v-model="searchQuery" ref="searchBar">
                <ul class="menu bg-base-200 fixed top-16 z-20 w-[40dvw] shadow-lg rounded-xl rounded-t-none" v-if="showHistory && searchHistory.length > 0">
                    <li @mousedown.prevent="" v-for="search in searchHistory.slice().reverse()" @click="searchQuery = search; showHistory = false; searchBar?.focus()"><a>{{ search }}</a></li>
                </ul>
            </div>

            <!-- Filters -->
            <div class="dropdown">
                <div tabindex="0" role="button" class="btn m-1">{{ getFilterName(filter) }}</div>
                <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                    <li @click="filter = SearchFilter.None"><a>{{ $t("ricerca.filtri.nessuno") }}</a></li>
                    <li @click="filter = SearchFilter.Shops"><a>{{ getFilterName(SearchFilter.Shops) }}</a></li>
                    <li @click="filter = SearchFilter.Products"><a>{{ getFilterName(SearchFilter.Products) }}</a></li>
                </ul>
            </div>
        </div>
        <div class="navbar-end text-white gap-4">
            <!-- bubbling up dell'evento -->
            <TransactionListButton/>
            <NotificationListButton/>
            <p>{{ username }}</p>
        </div>
    </div>
</template>