function IconMaker(options) {
    this.form = options.form;
    this.formElems = this.form.elements;
    this.iconsCont = options.iconsContainer;
    this.icons = options.icons;

    this.addNewIcon = options.addNewIcon;

    this.newIcon = null;
    this.iconsBEMNames = this.getBEMNames(this.iconsCont.className);
    this.addIcons();
    this.clearForm();


    this.iconsCont.addEventListener('mousedown', function (e) {
        e.preventDefault();
    });
    this.iconsCont.addEventListener('click', this.showSelectedIcon.bind(this));
    this.form.addEventListener('submit', this.createNewIcon.bind(this));
}

IconMaker.prototype.addIcons = function () {
    var ul = document.createElement('ul');
    ul.classList.add(this.iconsBEMNames.list);

    var icons = this.createIcons();
    icons.forEach(function (icon) {
        ul.appendChild(icon);
    });
    this.iconsCont.appendChild(ul);
    this.iconsCont.style.visibility = 'visible';
};

IconMaker.prototype.createIcons = function () {
    var array = [];

    this.icons.forEach(function (icon) {
        var li = document.createElement('li');
        li.classList.add(this.iconsBEMNames.item);

        var img = document.createElement('img');
        img.classList.add(this.iconsBEMNames.image);

        img.src = icon;
        var alt = icon.slice(6);
        alt = alt.substr(0, alt.length - 4);
        img.alt = alt;

        li.appendChild(img);
        array.push(li);
    }.bind(this));

    return array;
};

IconMaker.prototype.showSelectedIcon = function (e) {
    if (e.target.tagName !== 'IMG') {
        return;
    }
    var label = this.form.querySelector('.createItem__image');

    if (label.children.length > 1) {
        label.removeChild(label.children[1]);
    }
    var newIcon = e.target.cloneNode(true);
    newIcon.style.position = 'absolute';
    label.appendChild(newIcon);
    this.formElems[1].value = e.target.getAttribute('src');
};

IconMaker.prototype.createNewIcon = function (e) {
    e.preventDefault();
    var text = this.formElems[0].value;
    var image = this.formElems[1].value;
    var id = this.randID();

    text = (!text) ? 'file' : text;
    image = (!image) ? 'icons/Blank.PNG' : image;

    this.newIcon = {
        id: id,
        text: text,
        img: image
    };

    this.addNewIcon(this.newIcon);
};


IconMaker.prototype.getBEMNames = function (className) {
    return {
        list: className + '__list',
        item: className + '__item',
        image: className + '__image'
    }
};

IconMaker.prototype.clearForm = function () {
    this.formElems[0].value = '';
    this.formElems[1].value = '';
};

IconMaker.prototype.randID = function () {
    return Math.random().toString(36).slice(5);
};