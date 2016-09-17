angular.module('otf-translate')
  .factory('$otfInterpolator', $otfInterpolator)

// @ngInject
function $otfInterpolator() {
  return {
    setLocale: function (locale) {
      return;
    },
    getInterpolationIdentifier: function () {
      return '$otfInterpolator';
    },
    interpolate: function (translation, parameters) {
      return translation;
    }
  };
};