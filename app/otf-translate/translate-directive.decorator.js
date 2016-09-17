angular
  .module('otf-translate')
  .decorator('translateDirective', translateDirectiveDecorator)

/* @ngInject */
function translateDirectiveDecorator($delegate, $otfTranslate) {
  var delegate = $delegate[0];
  var delegateCompile = delegate.compile;

  delegate.compile = compile;
  return $delegate;

  function compile(element, attrs) {
    var delegateLink = delegateCompile(element, attrs);
    return function (scope, element, attrs) {
      // TODO: Should be changed to a directive with less impact on layout and reused for all translations
      var input = angular.element('<input/>');
      var key = getTranslationKey();
      var master = undefined;
      initMaster();

      // Update translation value if changed
      input.bind('blur', function () {
        if (master === input.val()) {
          return;
        }
        $otfTranslate.update(key, input.val())
          .then(function () {
            master = input.val();
          }, initMaster);
      });

      scope.$on('$destroy', function () {
        input.unbind('blur');
      });

      // Add input after translate directive
      element.after(input);
      delegateLink(scope, element, attrs);

      /**
       * Retrieve translation key.
       */
      function getTranslationKey() {
        var key = attrs['translate'];
        // Directive is use on element (<translate>foo</translate>) or has no associated key (<ANY translate>foo</ANY>)
        // Use element text as key.
        if ('' === key || undefined === key) {
          key = element.text();
        }
        return key;
      }

      /**
       * Initialize master translation with uninterpolated value.
       */
      function initMaster() {
        return $otfTranslate.getUninterpolatedValue(key)
          .then(function (translation) {
            master = translation;
            input.val(master);
          });
      }
    }
  }
}