// based on the following example: http://bl.ocks.org/wpoely86/e285b8e4c7b84710e463
import Ember from 'ember';
import d3Mixin from '../mixins/d3-mixin';

// Import the D3 packages we want to use
import { select, selectAll } from 'd3-selection';
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
import { axisLeft, axisTop } from 'd3-axis';
import { min, max } from 'd3-array';
import { transition } from 'd3-transition';
import { easeCubicInOut } from 'd3-ease';

const { get } = Ember;

export default Ember.Component.extend(d3Mixin, {
  name: 'diverging-stacked-bar',

  top: 50,
  right: 20,
  bottom: 20,
  left: 75,

  spacing: 20,

  draw() {
    const { data, margin, spacing } = this.getProperties('data', 'margin', 'spacing');
    const width = this.get('_width');
    const height = this.get('_height');
    const svg = select(document.getElementById(this.id))
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    const y = scaleBand().rangeRound([0, height]);
    const x = scaleLinear().rangeRound([0, width]);

    const colorChoices = ["#c7001e", "#f6a580", "#cccccc", "#92c6db", "#086fad"];
    const color = scaleOrdinal()
      .range(colorChoices)
      .domain(1,2,3,4,5);
    const xAxis = axisTop(x);
    const yAxis = axisLeft(y);

    color.domain(["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]);

    if (data) {
      data.forEach((d) => {
        d["Strongly disagree"] = +d[1]*100/d.N;
        d["Disagree"] = +d[2]*100/d.N;
        d["Neither agree nor disagree"] = +d[3]*100/d.N;
        d["Agree"] = +d[4]*100/d.N;
        d["Strongly agree"] = +d[5]*100/d.N;

        let x0 = -1*(d["Neither agree nor disagree"]/2+d["Disagree"]+d["Strongly disagree"]);
        let idx = 0;
        d.boxes = color.domain().map((name) => ({
          Question: d.Question, 
          name, 
          x0, 
          x1: x0 += +d[name], 
          N: +d.N, 
          n: +d[idx += 1]
        }));
      });

      let t = transition().duration(250).ease(easeCubicInOut);
      let min_val = min(data, (d) => d.boxes['0'].x0);
      let max_val = max(data, (d) => d.boxes['4'].x1); 

      x.domain([min_val, max_val]);
      y.domain(data.map((d) => d.Question));

      svg.append('g')
        .attr('class', 'x axis')
        .call(xAxis);
      
      svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

      const vakken = svg.selectAll(".question")
          .data(data)
        .enter().append('g')
          .attr('class', 'bar')
          .attr('transform', (d) => `translate(0,${y(d.Question)})`);

      const bars = vakken.selectAll('rect')
          .data((d) => d.boxes)
        .enter().append('g').attr('class', 'subbar');

      // EXIT
      bars.exit()
        .transition(t)
        .attr('width', 0)
        .remove();


      bars.append('rect')
        .attr('x', (d) => x(d.x0) )
        .attr('y', spacing / 2 )
        .attr('height', y.bandwidth() - spacing)
        .attr('width', (d) => x(d.x1) - x(d.x0))
        .style('fill', (d) => color(d.name));

      bars.append('text')
        .attr('x', (d) => x(d.x0))
        .attr('y', y.bandwidth() / 2)
        .attr('dy', '0.5em')
        .attr('dx', '0.5em')
        .style('font', '10px sans-serif')
        .style('text-anchor', 'begin')
        .text((d) => d.n !== 0 && (d.x1-d.x0)>3 ? d.n : '');

      vakken.insert('rect', ':first-child')
        .attr('height', y.bandwidth() - spacing)
        .attr('x', '1')
        .attr('y', spacing / 2 )
        .attr('width', width)
        .attr('fill-opacity', '0.5')
        .style('fill', '#F5F5F5')
        .attr('class', (d, i) => i / 2 == 0 ? 'even' : 'uneven');

      svg.append('g')
          .attr('class', 'y axis')
        .append('line')
          .attr('x1', x(0))
          .attr('x2', x(0))
          .attr('y2', height);

      const startp = svg.append('g')
        .attr('class', 'legendbox')
        .attr('id', get(this, 'elementId') + '-legendbox');

      const legendTabs = [0, 120, 200, 375, 450];
      const legend = startp.selectAll('.legend')
          .data(color.domain().slice())
        .enter().append('g')
          .attr('class', 'legend')
          .attr('transform', (d, i) => `translate(${legendTabs[i]}, -45)`);

      legend.append('rect')
        .attr('x', 0)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', color);

      legend.append('text')
        .attr('x', 22)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'begin')
        .style('font' ,'10px sans-serif')
        .text((d) => d);

      selectAll('.axis path')
        .style('fill', 'none')
        .style('stroke', '#000')
        .style('shape-rendering', 'crispEdges');

      selectAll('.axis line')
        .style('fill', 'none')
        .style('stroke', '#000')
        .style('shape-rendering', 'crispEdges')
      
      const movesize = width/2 - startp.node().getBBox().width/2;
      selectAll('.legendbox')
        .attr('transform', `translate(${movesize}, 0)`);
    }

  }

});
