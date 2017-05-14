import Ember from 'ember';

const { run, computed, get } = Ember;

const d3 = Ember.Mixin.create({
  tagName: '',

  init() {
    this._super(...arguments);
    this.id = `${get(this, 'name')}-${Math.random().toString(36).substr(2, 10)}`;
  },

  didReceiveAttrs() {
    run.scheduleOnce('render', this, this.draw);
  },

  name: 'd3', // overwritten by implementation
  data: null, // overwritten by container
  top: 20,
  right: 20,
  bottom: 20,
  left: 20,

  isCanvas: false,

  width: 1024,
  height: 350,

  _width: computed('width', function() { 
    return get(this, 'width') - get(this, 'margin.left') - get(this, 'margin.right');
  }),
  _height: computed('height', function() { 
    return get(this, 'height') - get(this, 'margin.top') - get(this, 'margin.bottom');
  }),

  margin: computed('top', 'left', 'right', 'bottom', function() {
    return {
      top: get(this, 'top'),
      right: get(this, 'right'), 
      bottom: get(this, 'bottom'), 
      left: get(this, 'left')
    };
  }),

  draw() {
    console.error(`The ${this.id} visualization has not implemented draw()!`);
  },



});

d3[Ember.NAME_KEY] = 'd3';

export default d3;