const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;


const request = indexedDB.open("CarsDatabase", 1);

request.onerror = function (event) {
    console.error("An error occured with IndexedDB");
    console.error(event);
}

/* fires when open brand new db or increase version number */
request.onupgradeneeded = function () {
    const db = request.result;
    const store = db.createObjectStore("cars", { keyPath: "id" });

    store.createIndex("cars_colour", ["colour"], { unique: false });
    store.createIndex("colour_and_make", ["colour", "make"], { unique: false });
}


request.onsuccess = function() {
    const db = request.result;

    const transaction = db.transaction("cars", "readwrite");
    const store = transaction.objectStore("cars");

    /* allow us to run our queries based on top created index */
    const colourIndex = store.index("cars_colour");
    const makeModelIndex = store.index("colour_and_make");

    /* if you want to have that data to be searchable in your database, you want to make sure those properties
    have an index associated with them */
    store.put({id: 1, colour: "Red", make: "Toyota"});
    store.put({id: 2, colour: "Red", make: "Kia"});
    store.put({id: 3, colour: "Blue", make: "Honda"});
    store.put({id: 4, colour: "Silver", make: "Subaru"});


    /* the get method by default is going to do a lookup on the keypath */
    const idQuery = store.get(4);


    const colourQuery = colourIndex.getAll(["Red"]);

    /* returns only the first record */
    const colourMakeQuery = makeModelIndex.get(["Blue", "Honda"]);


    idQuery.onsuccess = function() {
        console.log('idQuery', idQuery.result)
    }

    colourQuery.onsuccess = function() {
        console.log('colourQuery', colourQuery.result)
    }

    colourMakeQuery.onsuccess = function() {
        console.log('colourMakeQuery', colourMakeQuery.result)
    }

    transaction.oncomplete = function() {
        db.close();
    }
}