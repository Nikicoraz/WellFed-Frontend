<template>
    <main>
        <Suspense>
            <template #default>
                <RouterView /> 
            </template>

            <template #fallback>
                <div class="flex items-center justify-center h-screen text-xl text-gray-500">
                    Caricamento del contenuto
                </div>
            </template>
        </Suspense>
    </main>
</template>