import Ember from 'ember';
import D3MixinMixin from 'd3-fun/mixins/d3-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | d3 mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let D3MixinObject = Ember.Object.extend(D3MixinMixin);
  let subject = D3MixinObject.create();
  assert.ok(subject);
});
