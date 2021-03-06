import Ember from 'ember';

export default Ember.Component.extend({
  flights: null,
  fixes: null,
  selection: null,

  data: Ember.computed.map('fixes', function(fix, i) {
    let flight = fix.get('flight');
    let id = flight.get('id');
    let color = flight.get('color');
    let competitionId = flight.get('competition_id');
    let removable = (i !== 0);
    return { id, color, competitionId, removable, fix };
  }),

  selectable: Ember.computed.gt('data.length', 1),

  actions: {
    select(id) {
      let current = this.get('selection');
      this.getWithDefault('onSelectionChange', Ember.K)(current === id ? null : id);
    },
  },
});
