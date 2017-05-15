import Ember from 'ember';
import d3Mixin from '../mixins/d3-mixin';

import { select, selectAll } from 'd3-selection';
import { scaleLinear, scaleBand, scaleOrdinal, schemeCategory10 } from 'd3-scale';
import { stack } from 'd3-shape';
import { axisLeft, axisBottom } from 'd3-axis';
import { min, max } from 'd3-array';
import { transition } from 'd3-transition';
import { easeCubicInOut } from 'd3-ease';


export default Ember.Component.extend(d3Mixin, {
  name: 'stacked-negative-values',
  tagName: 'svg',
  attributeBindings: ['_width:width', '_height:height'],

  left: 60,

  draw() {
    const { data, margin } = this.getProperties('data', 'margin');
    const width = this.get('_width');
    const height = this.get('_height');
    const svg = select(this.element);
    const t = transition().duration(250).ease(easeCubicInOut);

    const series = stack()
        .keys(["apples", "bananas", "cherries", "dates"])
        .offset(stackOffsetDiverging)(data);

    const x = scaleBand()
        .domain(data.map((d) =>  d.month))
        .rangeRound([margin.left, width - margin.right])
        .padding(0.1);

    const y = scaleLinear()
        .domain([min(series, stackMin), max(series, stackMax)])
        .rangeRound([height - margin.bottom, margin.top]);

    const z = scaleOrdinal(schemeCategory10);

    // const svg.selectAll('rect').exit()
    //   .transition(t)
    //   .attr('height', 0)
    //   .remove();

    const rectangles = svg.append("g")
      .selectAll("g")
      .data(series)
    .enter().append("g")
      .attr("fill", (d) => z(d.key))
    .selectAll("rect")
      .data((d) =>  d);
    
    rectangles.exit()
      .transition(t)
      .attr('height', 0)
      .remove();
    
    let enterJoin = rectangles
      .enter().append("rect")
        .attr("width", x.bandwidth)
        .attr("x", (d) => x(d.data.month))
        .attr("y", (d) => y(d[1]))
        .attr("height", (d) => y(d[0]) - y(d[1]));
      
    enterJoin.merge(rectangles)
      .transition(t)
      .attr("x", (d) => x(d.data.month))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]));

    const bottom = svg.append("g")
        .attr("transform", "translate(0," + y(0) + ")")
        .attr('class', 'x axis')
        .call(axisBottom(x));

    const left = svg.append("g")
        .attr("transform", "translate(" + margin.left + ",0)")
        .attr('class', 'y axis');

    bottom.exit()
      .attr('opacity', 0)
      .remove();

    left.exit()
      .attr('opacity', 0)
      .remove();

    let leftJoin = left
      .call(axisLeft(y));

    leftJoin.merge(left)
      .transition(t)
      .attr('opacity', 1)
      .call(axisLeft(y));




    function stackMin(serie) {
      return min(serie, (d) => d[0]);
    }

    function stackMax(serie) {
      return max(serie, (d) => d[1]);
    }

    function stackOffsetDiverging(series, order) {
      if (!((n = series.length) > 1)) return;
      for (var i, j = 0, d, dy, yp, yn, n, m = series[order[0]].length; j < m; ++j) {
        for (yp = yn = 0, i = 0; i < n; ++i) {
          if ((dy = (d = series[order[i]][j])[1] - d[0]) >= 0) {
            d[0] = yp, d[1] = yp += dy;
          } else if (dy < 0) {
            d[1] = yn, d[0] = yn += dy;
          } else {
            d[0] = yp;
          }
        }
      }
    }

  }

});
