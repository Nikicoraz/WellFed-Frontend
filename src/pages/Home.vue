<script setup lang="ts">
    import cookies from 'vue-cookies';
    import { router } from '../extensions/router';
    import NavBar from '../components/NavBar.vue';
    import QRScanner from '../components/QRScanner.vue';
    import ShopList from '../components/ShopList.vue';
    import DiscoverShopList from '../components/DiscoverShopList.vue';

    const token = (cookies as any).get("token");
    if(!token) {
        router.push("/login");
    }
    
    // Redirect del mercante alla sua pagina
    const merchantID = (cookies as any).get("merchantID"); 
    if(merchantID) {
        router.push("/shop/" + merchantID);
    }
</script>

<template>
    <div class="bg-fed-bg min-h-screen h-full">
        <NavBar />
        <QRScanner />
        <ShopList />
        <!-- Non essendo presente nelle User Story potrebbe benissimo venir tolta
         Ma la home sembrava un po' vuota senza vicinanza geografica o preferiti quindi boh per ora l'ho messo
         Per quanto mi riguarda possiamo toglierla -->
        <DiscoverShopList />
    </div>
</template>