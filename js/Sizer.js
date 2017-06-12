function Sizer(options) {
    this.form = options.form;
    this.elems = [].slice.call(this.form.elements);
    this.resize = options.resize;

    this.isValid = false;
    this.measurements = {};

    this.form.addEventListener('submit', this.formOnSubmit.bind(this));
    this.form.addEventListener('focus', this.hideWarning.bind(this), true);
}

Sizer.prototype.formOnSubmit = function (e) {
    e.preventDefault();
    this.validate();
    if (this.isValid) {
        this.setMeasurements();
        this.checkProportions();
        this.resize(this.measurements);
    }
};

Sizer.prototype.validate = function () {
    this.isValid = true;
    this.elems.forEach(function (elem) {
        var value = parseInt(elem.value);
        if (elem.tagName === 'BUTTON') {
            return;
        }
        if (!value) {
            var message = 'Please, set a number';
            this.showWarning(elem, message);
            this.isValid = false;
        }
    }.bind(this));
};

Sizer.prototype.setMeasurements = function () {
    this.elems.forEach(function (elem) {
        if (elem.tagName === 'BUTTON') {
            return;
        }
        this.measurements[elem.name] = parseInt(elem.value);
    }.bind(this));
};

Sizer.prototype.checkProportions = function () {
    for (var key in this.measurements) {
        var size = this.measurements[key];
        switch (key) {
            case 'contWidth':
                size = (size < 200) ? 200 : size;
                size = (size > 600) ? 600 : size;
                break;
            case 'contHeight':
                size = (size < 150) ? 150 : size;
                size = (size > 400) ? 400 : size;
                break;
            case 'itemWidth':
                var contWidth = this.measurements['contWidth'];
                size = (size < 60) ? 60 : size;
                size = (size > 130) ? 130 : size;
                size = (contWidth >= 200 && contWidth <= 270) ? 80 : size;
                break;
            case 'itemHeight':
                var iconWidth = this.measurements['itemWidth'];
                var difference = iconWidth - size;
                size = (difference > 20) ? iconWidth - 20 : size;
                size = (difference < -10) ? +iconWidth + 10 : size;
                break;
        }
        this.measurements[key] = size;
    }
};

Sizer.prototype.showWarning = function (elem, message) {
    elem.value = message;
    elem.classList.add('input--warning');
};

Sizer.prototype.hideWarning = function () {
    this.elems.forEach(function (elem) {
        if (elem.classList.contains('input--warning')) {
            elem.value = '';
            elem.classList.remove('input--warning');
        }
    });
};