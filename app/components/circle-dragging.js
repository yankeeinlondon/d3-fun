import Ember from 'ember';
import d3Mixin from '../mixins/d3-mixin';
import { select, event } from 'd3-selection';
import { drag } from 'd3-drag';
import { scaleOrdinal, schemeCategory20 } from 'd3-scale';

export default Ember.Component.extend(d3Mixin, { 
  tagName: '',
  isCanvas: true,
  name: 'circle-dragging',

  draw() {
    const circles = this.get('data');
    const canvas = select(document.getElementById(this.id));
    const context = canvas.node().getContext("2d");
    const width = canvas.property("width");
    const height = canvas.property("height");
    const radius = 32;

    if(!circles) { return; }

    const render = (context) => {
      context.clearRect(0, 0, width, height);
      for (var i = 0, n = circles.length, circle; i < n; ++i) {
        circle = circles[i];
        context.beginPath();
        context.moveTo(circle.x + radius, circle.y);
        context.arc(circle.x, circle.y, radius, 0, 2 * Math.PI);
        context.fillStyle = color(circle.index);
        context.fill();
        if (circle.active) {
          context.lineWidth = 2;
          context.stroke();
        }
      } 
    };

    const dragsubject = (circles, radius) => ()  => {
      var i = 0,
          n = circles.length,
          dx,
          dy,
          d2,
          s2 = radius * radius * 4, // Double the radius.
          circle,
          subject;

      for (i = 0; i < n; ++i) {
        circle = circles[i];
        dx = event.x - circle.x;
        dy = event.y - circle.y;
        d2 = dx * dx + dy * dy;
        if (d2 < s2) subject = circle, s2 = d2;
      }

      return subject;
    }

    const dragstarted = (circles) => () => {
      circles.splice(circles.indexOf(event.subject), 1);
      circles.push(event.subject);
      event.subject.active = true;
    }

    const dragged = () => {
      event.subject.x = event.x;
      event.subject.y = event.y;
    }

    const dragended = () => {
      event.subject.active = false;
    }

    var color = scaleOrdinal()
        .range(schemeCategory20);

    render(context);

    canvas.call(drag()
      .subject(dragsubject(circles, radius))
      .on("start", dragstarted(circles))
      .on("drag", dragged)
      .on("end", dragended)
      .on("start.render drag.render end.render", render));
    }

});

