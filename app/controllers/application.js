import Ember from 'ember';
import { range } from 'd3-array';
const { run, get, set } = Ember;
const TRANSITION_INTERVAL = 3000;

const randomNumber = (min, max) => ()  => {
  return Math.floor(Math.random() * (max - min)) + min;
}

const sum = (items) => items.reduce((agg, item) => agg + item, 0);

const repeat = (howMany, reducer) => (fn) => {
  let output = [];
  for(let i = 1; i < howMany; i++) {
    output.push(fn());
  }

  return reducer(output);
}

export default Ember.Controller.extend({
  init() {
    run.schedule('render', this, this.cycleCircles);
    run.schedule('render', this, this.cycleDivergingStackedBar);
    run.schedule('render', this, this.circleDragging);
  },

  cycleCircles() {
    set(this, 'circles', [
      { color: 'steelblue', value: randomNumber(10,190)(), timestamp: randomNumber(1494565646, 1494824843 - 8000)() },
      { color: 'darkblue', value: randomNumber(10,190)(), timestamp: randomNumber(1494565646 + 8000, 1494824843)() },
      { color: 'blue', value: randomNumber(10,190)(), timestamp: randomNumber(1494565646 + 16000, 1494824843)() },
    ]);
    run.later(this, this.cycleCircles, TRANSITION_INTERVAL);
  },

  cycleDivergingStackedBar() {
    set(this, 'divergingStackedBar', [
      { 
        Question: 'Even Dist', 
        1: randomNumber(1, 1000)(),
        2: randomNumber(1, 1000)(),
        3: randomNumber(1, 1000)(),
        4: randomNumber(1, 1000)(),
        5: randomNumber(1, 1000)()
      },
      { 
        Question: 'Positive Shift', 
        1: repeat(10, sum)(randomNumber(1, 10)),
        2: repeat(20, sum)(randomNumber(1, 10)),
        3: repeat(40, sum)(randomNumber(1, 10)),
        4: repeat(30, sum)(randomNumber(1, 10)),
        5: repeat(30, sum)(randomNumber(1, 10))
      },
      { 
        Question: 'Negative Shift', 
        1: repeat(30, sum)(randomNumber(1, 10)),
        2: repeat(30, sum)(randomNumber(1, 10)),
        3: repeat(40, sum)(randomNumber(1, 10)),
        4: repeat(10, sum)(randomNumber(1, 10)),
        5: repeat(10, sum)(randomNumber(1, 10))
      },
      { 
        Question: 'Center Bias', 
        1: repeat(10, sum)(randomNumber(1, 50)),
        2: repeat(20, sum)(randomNumber(1, 50)),
        3: repeat(60, sum)(randomNumber(1, 50)),
        4: repeat(20, sum)(randomNumber(1, 50)),
        5: repeat(10, sum)(randomNumber(1, 50))
      },
      { 
        Question: 'Extremes', 
        1: repeat(30, sum)(randomNumber(1, 1000)),
        2: repeat(15, sum)(randomNumber(1, 1000)),
        3: repeat(10, sum)(randomNumber(1, 1000)),
        4: repeat(15, sum)(randomNumber(1, 1000)),
        5: repeat(30, sum)(randomNumber(1, 1000))
      }
    ].map(q => 
      Ember.assign(q, { N: q['1'] + q['2'] + q['3'] + q['4'] + q['5'] }))
    );

    // run.later(this, this.cycleDivergingStackedBar, TRANSITION_INTERVAL);
  },

  circleDragging() {
    const width = get(this, 'circleDraggingWidth');
    const height = get(this, 'circleDraggingHeight');
    const radius = get(this, 'circleDraggingRadius');

    let circles = range(20).map(function(i) {
      return {
        index: i,
        x: Math.round(Math.random() * (width - radius * 2) + radius),
        y: Math.round(Math.random() * (height - radius * 2) + radius)
      };
    });

    this.set('circleDraggingData', circles);
  },

  circleDraggingWidth: 1024,
  circleDraggingHeight: 350,
  circleDraggingRadius: 32,

});
