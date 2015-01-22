export function initialize(container, application) {
  application.inject('controller:menu', 'cookie', 'cookie:main');
}

export default {
  name: 'crabmans-initializer',
  after: ['cookie'],
  initialize: initialize
};
