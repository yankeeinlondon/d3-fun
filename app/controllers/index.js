import Ember from 'ember';
const { computed } = Ember;

export default Ember.Controller.extend({
  data: computed(function() {
    return [
      { value: 45, timestamp: 1494565646 },
      { value: 60, timestamp: 1494652043 },
      { value: 120, timestamp: 1494824843 },
    ];
  })
});
