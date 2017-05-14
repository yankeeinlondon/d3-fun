import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('diverging-stacked-bar', 'Integration | Component | diverging stacked bar', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{diverging-stacked-bar}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#diverging-stacked-bar}}
      template block text
    {{/diverging-stacked-bar}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
