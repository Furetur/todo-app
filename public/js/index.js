async function loadPage(){
    await memory.update();

    tabs.update();
    field.update();
    mainContent.updateTodoList(memory.thisWeekByDays[memory.now().getDay()]);

}

loadPage().catch(e => {
    console.warn('error loading the page:', e);
});
