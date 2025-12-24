export default {
    login: {
        credenziali: "Accedi con credenziali",
        accedi: "Accedi",
        registrati: "Registrati",
        oppure: "Oppure"
    },
    register: {
        informazioni: "Inserisci le informazioni",
        nomeNegozio: "Nome del negozio",
        indirizzoNegozio: "Indirizzo del negozio",
        cliente: "Cliente",
        commerciante: "Commerciante",
        processando: "L'account sta venendo processato",
        creato: "L'account è stato creato",
        formatoPassword: "Almeno 8 caratteri, una lettera minuscola, una lettera maiuscola, un numero e un carattere speciale",
        reqPassword: "La password non rispetta i requisiti minimi di sicurezza, deve essere lunga almeno 8 caratteri e contenere: una lettera minuscola, una lettera maiuscola, un numero e un carattere speciale",
        reqEmail: "L'email inserita non è valida!",
    },
    alerts: {
        datiNonValidi: "Sono stati inseriti dati non validi!",
        partitaIVAInvalida: "La validazione della partita IVA è fallita",
        emailInUso: "L'email inserita ha già un account registrato",
        erroreAccount: "Errore durante la creazione dell'account",
        autenticazioneFallita: "Autenticazione fallita",
        noimage: "Occorre inserire un'immagine!",
        googleTokenInvalido: "Errore durante l'autenticazione SSO",
        emailInUsoSSO: "L'email associata con l'account Google è già registrata nel sistema. Si prega di utilizzare la pagina di login",
        emailInUsoLocale: "L'email associata con l'account Google è già registrata nel sistema. Si prega di autenticarsi con le credenziali locali",
        errore: "Errore",
        nessunProdotto: "Occorre selezionare almeno un prodotto!",
        nonAutorizzato: "Non sei autorizzato ad eseguire questa operazione"
    },
    product: {
        origine: "Origine",
        descrizione: "Descrizione",
        punti: "Punti"
    },
    button: {
        chiudi: "Chiudi"
    },
    ricerca: {
        origine: "Origin",
        punti: "Punti",
        cerca: "Cerca",
        filtri: {
            nome: "Filtri",
            nessuno: "Nessuno",
            negozi: "Solo negozi",
            prodotti: "Solo prodotti"
        }
    },
    shop: {
        nome: "Nome",
        negozioNonTrovato: "Il negozio non esiste",
        altImmagineNegozio: "Immagine del negozio",
        prodotti: "Prodotti",
        premi: "Premi",
        descrizione: "Descrizione",
        origine: "Origine",
        punti: "Punti",
        immagine: "Cambia immagine",
        annulla: "Annulla",
        salva: "Salva",
        nessunPunto: "Non assegna punti",
        conferma: "Conferma",
        elimina: "Elimina",
        validita: "Valido per:",
        scaduto: "Il QR code è scaduto",
        prodotto: {
            nuovo: "Aggiungi un nuovo prodotto",
            creato: "Il prodotto è stato aggiunto al negozio con successo!",
            aggiornato: "Il prodotto è stato aggiornato con successo!",
            confermaCancellazione: "Sei sicuro che vuoi cancellare questo prodotto?",
            cancellato: "Il prodotto è stato cancellato con successo"
        },
        premio: {
            nuovo: "Aggiungi un nuovo premio",
            creato: "Il premio è stato aggiunto al negozio con successo!",
            aggiornato: "Il premio è stato aggiornato con successo!",
            confermaCancellazione: "Sei sicuro che vuoi cancellare questo premio?",
            cancellato: "Il premio è stato cancellato con successo",
            riscatta: "Riscatta",
            confermaRiscatto: "Sei sicuro che vuoi riscattare questo premio?"
        },
        qrcode: {
            mostraACliente: "Fai scansionare questo QR code al cliente per assegnargli i punti!",
            invalido: "Il qr code scannerizzato non è valido"
        },
        transazioni: {
            nuova: "Nuova transazione",
            conferma: "Conferma transazione",
            annulla: "Annulla transazione",
            successo: "La transazione è avvenuta con successo"
        }
    },
    cronologiaTransazioni: {
        header: "Ultime transazioni avvenute",
        nessunaTransazione: "Nessuna transazioni trovata",
        commerciante: "Commerciante",
        cliente: "Cliente",
        data: "Data",
        ora: "Ora",
        prodotti: {
            header: "Prodotti coinvolti nella transazione",
            tabella: {
                nome: "Nome",
                quantita: "Quantità",
                puntiPerUnita: "Punti per unità",
                puntiTotali: "Punti totali"
            }
        },
        premi: {
            header: "Prodotti coinvolti nella transazione",
            tabella: {
                nome: "Nome",
                punti: "Punti"
            }
        },
        tipo: {
            assegnamentoPunti: "Assegnamento Punti",
            riscossionePremi: "Riscossioni Premi"
        }
    },
    casellaNotifiche: {
        header: "Casella delle notifiche",
        nessunaNotifica: "Non è presente alcuna notifica",
        eliminaTutteLette: "Elimina notifiche lette",
        segnaTuttoComeLetto: "Segna tutto come letto",
        redirectNegozio: "Portami al negozio",
        eliminaNotifica: "Elimina",
    }
};
