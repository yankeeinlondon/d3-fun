import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('stacked-negative-values', 'Integration | Component | stacked negative values', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{stacked-negative-values}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#stacked-negative-values}}
      template block text
    {{/stacked-negative-values}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
