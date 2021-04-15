let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore("pending" , {autoIncrement: true});

}

request.onsuccess = function(event) {
    db = event.target.result;

if (navigator.online) {
    checkDB();
}
};

request.onerror = function(event) {
    console.log("error! " + event.target.errorcode)
};

function saveRecords(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore('pending');
    store.add(record);
}

function checkDB() {
    const transaction = db.transaction(['pending'], "readwrite");
    const store = transaction.objectStore('pending');
    const getAll = store.getAll();

    get.All.onsuccess = function() {
        console.log(getAll.result)
        if(getAll.result.length > 0 ) {
            console.log(getAll.result)
            fetch("/api/transaction/bulk" , {
                method: "POST",
                body: JSON.stringify(getAll.result), 
                headers: {
                    Accept: "application/json, text/plain, */*",
                "Content-type": "application/json"  
            }
            })
            .then(response => response.json())
            .then(() => {
                const transaction = db.transaction(["pending"], "readwrite");
                const store = transaction.objectStore("pending");
                store.clear();
            })
        }
    }
}

window.addEventListener("online", checkDatabase);