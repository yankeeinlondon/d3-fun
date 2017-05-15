// based on the following example: https://bl.ocks.org/mbostock/3894205
import Ember from 'ember';
import d3Mixin from '../mixins/d3-mixin';
import { select } from 'd3-selection';
import { scaleTime, scaleLinear } from 'd3-scale';
import { axisLeft, axisBottom } from 'd3-axis';
import { area, line, curveBasis } from 'd3-shape';
import { min, max, extent } from 'd3-array';

const dateStringToUnixEpoc = (s) => Date.UTC(s.slice(0,4), s.slice(5,2), s.slice(8,2));

export default Ember.Component.extend(d3Mixin, {
  name: 'difference-chart',
  tagName: 'svg',
  attributeBindings: ['_width:width', '_height:height'],
  classNames: ['difference-chart'],
  classNameBindings: ['name', 'class'],

  width: 1024,
  height: 350,
  left: 50,
  bottom: 50,

  draw() {
    const { data, margin } = this.getProperties('data', 'margin');
    const width = this.get('_width');
    const height = this.get('_height');
    const svg = select(this.element)
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = scaleTime()
      .domain(extent(data, (d) => dateStringToUnixEpoc(d.date)) )
      .range([0, width]);

    const y = scaleLinear()
      .range([height, 0]);

    const xAxis = axisBottom().scale(x);
    const yAxis = axisLeft().scale(y);

    const myLine = line()
      .x((d) => x(d.date))
      .y((d) => y(d["New York"]))
      .curve(curveBasis);
    
    const myArea = area()
        .x((d) => x(d.date))
        .y1((d) => y(d["New York"]))
        .curve(curveBasis);

    if(data) {

      data.forEach((d) => {
        d.date = dateStringToUnixEpoc(d.date);
        d["New York"]= +d["New York"];
        d["San Francisco"] = +d["San Francisco"];
      });

      y.domain([
        min(data, (d) => Math.min(d["New York"], d["San Francisco"])),
        max(data, (d) => Math.max(d["New York"], d["San Francisco"]))
      ]);

      svg.datum(data);

      svg.append("clipPath")
          .attr("id", "clip-below")
        .append("path")
          .attr("d", myArea.y0(height));

      svg.append("clipPath")
          .attr("id", "clip-above")
        .append("path")
          .attr("d", myArea.y0(0));

      svg.append("path")
          .attr("class", "area above")
          .attr("clip-path", "url(#clip-above)")
          .attr("d", myArea.y0((d) => y(d["San Francisco"])));

      svg.append("path")
          .attr("class", "area below")
          .attr("clip-path", "url(#clip-below)")
          .attr("d", myArea);

      svg.append("path")
          .attr("class", "line")
          .attr("d", myLine);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Temperature (ºF)");
    }
  }

});
