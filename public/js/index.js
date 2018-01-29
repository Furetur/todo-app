alertify.set('notifier','position', 'bottom-left');

function updateContent(){
    tabs.update();
    field.update();
    mainContent.updateTodoList(memory.thisWeekByDays[memory.now().getDay()]);
}

async function loadPage(){
    await memory.organiseTodos();
    updateContent();
    await memory.update();
    updateContent();
    
}

function registerServiceWorker(){
    if(!navigator.serviceWorker) return;

    navigator.serviceWorker.register('/sw.js').then(reg => {
        console.log('Service worker registered');

        if(reg.waiting){
            //there is already a waiting update
            updateReady(reg.waiting);
        }

        if(reg.installing){
            //update installing
            trackInstallingWorker(reg.installing);
        }

        reg.addEventListener('updatefound', function(){
            //update found in background
            trackInstallingWorker(reg.installing);
        })

        
    }).catch(e => {
        console.warn('failed to register service worker:', e);
    })

    let refreshing; //this works around a bug in 'Force on reload'
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        //controlling service worker has changed
        if(refreshing) return;
        window.location.reload();
        refreshing = true;
    });
}


function trackInstallingWorker(worker){
    worker.addEventListener('statechange', function(){
        if(this.state === 'installed'){
            //update succesfully installed
            updateReady(worker);
        }
    })
}


function updateReady(worker){
    alertify.message('Theres an update ready. Click to refresh', 0, () => {
        worker.postMessage({
            action: 'skipWaiting'
        })
    });
}


registerServiceWorker();
loadPage().catch(e => {
    console.warn('error loading the page:', e);
});
