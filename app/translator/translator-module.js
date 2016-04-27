angular.module('app.translator', [
    'app.translations'
]).run(run);

/** @ngInject */
function run($translate, $http) {
    initialize();

    function initialize() {
        var elements = angular.element(document.querySelectorAll("[translate]"));
        angular.forEach(elements, function (domElement) {
            initializeTranslatableElement(domElement);
        });
    }

    function initializeTranslatableElement(domElement) {
        var element = angular.element(domElement);
        if ('' === element.attr('translate')) {
            return;
        }

        element.addClass('translatable');
        element.bind('click', function () {
            var input = angular.element('<input>');
            input.val(element.text());
            element.hide();
            element.after(input);
            input.focus();

            input.blur(function () {
                element.text(input.val());
                element.show();
                input.remove();

                $http({
                    method: 'PUT',
                    url: '/i18n/' + $translate.resolveClientLocale(),
                    data: {
                        key: element.attr('translate'),
                        value: element.text()
                    }
                }).then(function (response) {
                    $translate.refresh($translate.resolveClientLocale());
                });
            });
        });
    }
}