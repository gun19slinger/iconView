function IconView(options) {
    this.container = options.container;
    this.measurements = options.measurements;
    this.items = options.items || [];

    this.contWidth = 300;
    this.contHeight = 200;
    this.itemWidth = 80;
    this.itemHeight = 60;

    this.checkButton = options.checkButton;
    this.deleteButton = options.deleteButton;

    this.list = null;
    this.checkedItems = {};

    this.init();

    this.container.addEventListener('mousedown', function (e) {
        e.preventDefault();
    });
    document.addEventListener('click', this.documentOnClick.bind(this));
}

IconView.prototype.init = function () {
    this.itemsBEMNames = this.getBEMNames(this.container.className);

    this.createList();
    this.addItems(this.items);
    this.setMeasurements(this.measurements);
};

IconView.prototype.documentOnClick = function (e) {
    if (e.which !== 1) {
        return;
    }
    var target = e.target;

    if (target === this.checkButton) {
        this.toggleCheckAll();
    } else if (target === this.deleteButton) {
        this.deleteChecked();
    } else {
        while (target !== e.currentTarget) {
            if (target.tagName === 'LI') {
                if (target.classList.contains(this.itemsBEMNames.item)) {
                    this.toggleCheck(target);
                }
            }
            target = target.parentNode;
        }
    }
};

IconView.prototype.toggleCheck = function (item) {
    if (item.classList.contains(this.itemsBEMNames.checkedItem)) {
        this.uncheckOne(item);
    } else {
        this.checkOne(item);
    }
};

IconView.prototype.toggleCheckAll = function () {
    if (Object.keys(this.checkedItems).length === 0) {
        this.checkAll();
    } else {
        this.uncheckAll();
    }
};

IconView.prototype.checkOne = function (item) {
    item.classList.add(this.itemsBEMNames.checkedItem);
    this.checkedItems[item.dataset.id] = item;
};

IconView.prototype.uncheckOne = function (item) {
    item.classList.remove(this.itemsBEMNames.checkedItem);
    delete this.checkedItems[item.dataset.id];
};

IconView.prototype.checkAll = function () {
    var items = this.list.querySelectorAll('li');
    items.forEach(function (item) {
        this.checkOne(item);
    }.bind(this));
};

IconView.prototype.uncheckAll = function () {
    for (var key in this.checkedItems) {
        this.uncheckOne(this.checkedItems[key]);
    }
};

IconView.prototype.deleteChecked = function () {
    for (var key in this.checkedItems) {
        var item = this.checkedItems[key];
        item.parentNode.removeChild(item);
        delete this.checkedItems[item.dataset.id];
    }
    this.checkProportions();
};


IconView.prototype.setMeasurements = function (measurements) {
    if (measurements) {
        this.contWidth = measurements.contWidth;
        this.contHeight = measurements.contHeight;
        this.itemWidth = measurements.itemWidth;
        this.itemHeight = measurements.itemHeight;
    }

    this.container.style.width = this.contWidth + 'px';
    this.container.style.height = this.contHeight + 'px';
    this.container.style.visibility = 'visible';

    var items = this.list.querySelectorAll('li');
    items.forEach(function (item) {
        this.setItemMeasurements(item);
    }.bind(this));

    this.checkProportions();
};

IconView.prototype.setItemMeasurements = function (item) {
    var margins = this.getMargins();
    var padding = this.getPadding();

    item.style.width = this.itemWidth + 'px';
    item.style.height = this.itemHeight + 'px';
    
    item.style.marginLeft = margins.left + 'px';
    item.style.marginTop = margins.top + 'px';
    item.style.paddingBottom = padding + 'px';

    var img = item.firstChild;
    img.style.width = img.style.height = Math.round(this.itemWidth * 75 / 100) + 'px';
};


IconView.prototype.createList = function () {
    this.list = document.createElement('ul');
    this.list.classList.add(this.itemsBEMNames.list);
    this.container.appendChild(this.list);
};

IconView.prototype.createItem = function (item) {
    var li = document.createElement('li');
    li.classList.add(this.itemsBEMNames.item);
    li.setAttribute('data-id', item.id);

    var img = document.createElement('img');
    img.classList.add(this.itemsBEMNames.image);
    img.src = item.img;
    img.alt = item.text;
    li.appendChild(img);

    var span = document.createElement('span');
    span.classList.add(this.itemsBEMNames.caption);
    span.innerHTML = item.text;
    li.appendChild(span);

    return li;
};

IconView.prototype.addItems = function (items) {
    items.forEach(function (item) {
        var li = this.createItem(item);
        this.list.appendChild(li);
    }.bind(this));
};

IconView.prototype.addItem = function (item) {
    var li = this.createItem(item);
    this.list.appendChild(li);
    this.setItemMeasurements(li);
    this.items.push(item);
    this.checkProportions();
};


IconView.prototype.getMargins = function () {
    var itemsInRow = Math.round(this.contWidth / this.itemWidth);
    if (itemsInRow > this.items.length) {
        itemsInRow = this.items.length;
    }
    var vacantSpace = this.contWidth - itemsInRow * this.itemWidth;
    if (vacantSpace < 10) {
        itemsInRow -= 1;
        vacantSpace = this.contWidth - itemsInRow * this.itemWidth;
    }
    var marginLeft = vacantSpace / (itemsInRow + 1);

    var rowsInCont = 0;
    var counter = this.contHeight;
    while (counter > this.itemHeight) {
        counter -= this.itemHeight;
        rowsInCont++;
    }
    if (rowsInCont === 1) {
        var marginTop = 5;
    } else {
        var marginTop = (this.contHeight - rowsInCont * this.itemHeight) / (rowsInCont + 1);
    }

    return {
        left: marginLeft,
        top: marginTop
    }
};

IconView.prototype.getPadding = function () {
    var difference = this.itemWidth - this.itemHeight;
    var padding = 0;
    if (difference <= 20 && difference >= 0) {
        padding = difference + 10;
    }
    return padding;
};

IconView.prototype.getBEMNames = function (className) {
    return {
        list: className + '__list',
        item: className + '__item',
        image: className + '__image',
        caption: className + '__caption',
        checkedItem: className + '__item' + '--checked'
    }
};

IconView.prototype.checkProportions = function () {
    var contStyle = getComputedStyle(this.container);
    var offset = this.container.offsetWidth - this.container.clientWidth
        - parseInt(contStyle.borderLeftWidth) - parseInt(contStyle.borderRightWidth);
    this.container.style.width = this.contWidth + offset + 'px';
};