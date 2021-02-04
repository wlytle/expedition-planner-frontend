import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as d3 from "d3";
import { Card } from "react-bootstrap";
import { CSSTransition } from "react-transition-group";
import { showElevation } from "../actions/TripActions";

const EleChart = ({
  data,
  width,
  height,
  setBlip,
  elevation,
  animateEle,
  showElevation,
}) => {
  useEffect(() => {
    drawChart();
  }, [data]);

  function drawChart() {
    // remove previous graphs and tooltips before drawing a new one
    d3.select("#container").select("svg").remove();
    d3.select("#container").select(".tooltip").remove();
    //Get chart bounds
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const yMinValue = d3.min(data, (d) => d.value);
    const yMaxValue = d3.max(data, (d) => d.value);
    const xMinValue = d3.min(data, (d) => d.label);
    const xMaxValue = d3.max(data, (d) => d.label);

    //add the SVG and tooltip elements
    const svg = d3
      .select("#container")
      .append("svg")
      //   .attr("width", width + margin.left + margin.right)
      //   .attr("height", height + margin.top + margin.bottom)
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      )
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add tooltip
    // const tooltip = d3
    //   .select("#container")
    //   .append("div")
    //   .attr("class", "tooltip");

    // set x scale
    const xScale = d3
      .scaleLinear()
      .domain([xMinValue, xMaxValue])
      .range([0, width]);

    //set y scale
    const yScale = d3
      .scaleLinear()
      .range([height, 0])
      .domain([yMinValue, yMaxValue]);

    // set line scale
    const area = d3
      .area()
      .x((d) => xScale(d.label))
      .y0(yScale(yScale.domain()[0]))
      .y1((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Define and evenly space out axis ticks
    const xAxisTicks = 8;
    const yAxisTicks = 6;
    const makeXGridlines = (xScale) => d3.axisBottom(xScale).ticks(xAxisTicks);
    const makeYGridlines = (yScale) => d3.axisLeft(yScale).ticks(yAxisTicks);

    d3.axisBottom(xScale)
      // ...
      .ticks(yAxisTicks)
      .tickSize(0)
      .tickPadding(9);

    d3.axisLeft(yScale)
      // ...
      .tickSize(0)
      .tickPadding(8)
      .ticks(yAxisTicks);

    // draw Y Grid
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(""));
    //   draw X Grid
    svg
      .append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(""));
    // draw X axis
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom().scale(xScale).tickSize(""));

    //x-axis label
    svg
      .append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width / 2 + 30)
      .attr("y", height + 30)
      .text("Distance (km)");

    //Y-axis label
    svg
      .append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", -45)
      .attr("x", -45)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Elevation (m)");

    // Draw y-axis
    svg
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale).tickSize(""));

    // draw data line
    svg
      .append("path")
      .datum(data)
      .attr("stroke", "#f6c3d0")
      .attr("stroke-width", 4)
      .attr("class", "area")

      .attr("d", area);

    //if the line is focused on add the tooltip
    const focus = svg
      .append("g")
      .attr("class", "focus")
      .style("display", "none");
    focus.append("circle").attr("r", 5).attr("class", "circle");

    // add the tooltip
    const tooltip = d3
      .select("#container")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // establish a rect over the chart to track mouse over events
    svg
      .append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .style("opacity", 0)
      .on("mouseover", () => {
        focus.style("display", null);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(50).style("opacity", 0);
      })
      .on("mousemove", mousemove);

    // handle mouse moving over the graph. Find the nearest plot point and add the marker and tooltip to that location
    function mousemove(event) {
      const bisect = d3.bisector((d) => d.label).left;
      const xPos = d3.mouse(this)[0];
      const x0 = bisect(data, xScale.invert(xPos));
      const d0 = data[x0];
      setBlip(d0.locs);
      focus.attr(
        "transform",
        `translate(${xScale(d0.label)},${yScale(d0.value)})`
      );
      tooltip.transition().duration(50).style("opacity", 0.9);
      tooltip
        .html(d0.tooltipContent || d0.label)
        .style(
          "transform",
          `translate(${xScale(d0.label)}px,${yScale(d0.value) - 350}px)`
        );
    }
  }

  const eleClass = animateEle ? "active" : "inactive";

  return (
    <Card
      id="ele-card"
      className={eleClass}
      style={{ transform: "translate(1%, 0)" }}
    >
      <div id="container" />
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    elevation: state.TripReducer.elevation,
    animateEle: state.TripReducer.animateEle,
  };
};

export default connect(mapStateToProps, { showElevation })(EleChart);
