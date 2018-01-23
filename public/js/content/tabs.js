
const tabs = {};

tabs._nav = document.getElementById('tabs');
tabs._tabTemplate = document.getElementById('nav-tab-template');

tabs._loadedTabs = [];

tabs._clear = function(){
    this._loadedTabs.length = 0;
    while (this._nav.firstChild) {
        this._nav.removeChild(this._nav.firstChild);
    }
};


tabs._getCloned = function () {
    return this._tabTemplate.content.cloneNode(true).querySelector('.tab');
};



tabs._activeTab = 7 - memory.now().getDay();

tabs._addTab = function (title, content, ...additionalClasses) {
    const id = this._loadedTabs.length;
    const tab = this._getCloned();
    const tabTitle = tab.querySelector('.tab-title');
    const badge = tab.querySelector('.badge');

    //set the title
    tabTitle.textContent = title;

    //style
    additionalClasses.forEach(cssClass => {
        tab.classList.add(cssClass)
    });

    //onclick
    tab.onclick = (event) => {
        this._loadedTabs[this._activeTab].classList.remove('active');

        this._activeTab = id;
        tab.classList.add('active');
        mainContent.updateTodoList(content, id !==  7 - memory.now().getDay());
        field.update(id);
    };

    //set up badge
    const badgeCount = content.filter(todo => todo.status === 'undone').length;
    if(badgeCount === 0){
        badge.classList.add('invisible');
    }
    badge.textContent = badgeCount;

    //render
    this._loadTab(tab);

};

tabs._loadTab = function (tab) {
    this._loadedTabs.push(tab);
    this._nav.appendChild(tab);
};


tabs._dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
tabs._tabNames = ['This Week', ...tabs._dayNames.reverse(), 'Overdue'];


tabs.update = function () {
    this._clear();


    this._tabNames.forEach((title, id) => {
        const classList = [];

        if(id === this._activeTab) classList.push('active');
        if(id === 0 || id === 8) classList.push('h5');
        if(id === 7 - memory.now().getDay()) classList.push('today');
        if(id > 7 - memory.now().getDay() && id !== 8) classList.push('disabled');

        let tabContent;
        if(id === 0) tabContent = memory.thisWeekUnorganised;
        if(0 < id && id < 8) tabContent = memory.thisWeekByDays[7 - id];
        if(id === 8) tabContent = memory.overdue;

        this._addTab(this._tabNames[id], tabContent, ...classList);
    });

};




