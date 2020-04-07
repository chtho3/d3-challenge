// Step 1: Set up our chart
//= ================================
var svgWidth = window.innerWidth - 250;
var svgHeight = window.innerHeight;

var margin = {
  top: 50,
  right: 50,
  bottom: 120,
  left: 120
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .classed("chart", true);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Step 3:
// Import data from the donuts.csv file
// =================================
d3.csv("../assets/data/data.csv").then(function(censusData) {

  // Format the data and convert to numerical and date values
  // ===============================

  // Format the data
  censusData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // Step 5: Create the scales for the chart
  // =================================
var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.poverty) * 0.8,
    d3.max(censusData, d => d.poverty) * 1.2
    ])
    .range([0,width])

var yLinearScale = d3.scaleLinear()
    .domain([d3.max(censusData, d => d.healthcare),
    d3.min(censusData, d => d.healthcare)
    ])
    .range([0, height])

// Step 3: Create axis functions
// ==============================
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);


 // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .classed("stateCircle", true)
    .attr("r", 15)
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))

    var circleText = chartGroup.selectAll(null).data(censusData).enter().append("text");

circleText
    .classed("stateText", true)
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("font-size", (10))
   ;

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(d => (`${d.state}<br>Poverty: ${d.poverty} <br>Healthcare: ${d.healthcare}`));

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 50)
      .attr("x", 0 - (height / 2)-50)
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lack Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2 - 50}, ${height + margin.top + 10})`)
      .attr("class", "axisText")
      .text("Poverty (%)");

  }).catch(function(error) {
    console.log(error);
  });
