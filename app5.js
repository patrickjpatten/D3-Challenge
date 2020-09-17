// Section 1: Pre-Data Setup
// SVG Container Set Up
var svgWidth = parseInt(d3.select("#scatter").style("width"));
var svgHeight = svgWidth - svgWidth / 3.9;
// margins
var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
};
// space for placing words
var labelArea = 110;
// padding for the text at the bottom and left axes
var tPadBot = 40;
var tPadLeft = 40; 
// chart area minus margins
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;   
//-----------------------------------------------------------------------------------------------//
// Read in CSV
  d3.csv("data.csv").then(function(csvData) {
    console.log(csvData);
    csvData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });
    // create svg container
    var svg = d3.select("#scatter").append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);
    // Group and shift everything over by the margins
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);   
    // 3.1 Create scale functions Healthcare vs Poverty
    // scale x to chart height
    var xScale = d3.scaleLinear()
      .domain([8, d3.max(csvData, x => x.poverty)+ 2])
      .range([0, chartWidth]);
    // scale y to chart width
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(csvData, x => x.healthcare) + 2])
      .range([chartHeight, 0]);
      // .padding(0.05);
    // 3.2 Create axis functions
    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);
    // set x to the bottom of the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis);
    // set y to the y axis
    // This syntax allows us to call the axis function
    // and pass in the selector without breaking the chaining
    chartGroup.append("g")
    .call(yAxis);
    // 3.4 Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(csvData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.poverty))
      .attr("cy", d => yScale(d.healthcare))
      .attr("r", "15")
      .attr("fill", "blue")
      .attr("opacity", ".5");
    // 3.4.1 Code here to add abbrevations to the circles
    chartGroup.selectAll("null")
      .data(csvData)
      .enter()
      .append("text")
      .text(function(x){
        return x.abbr;
      })
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("font-size", "12")
      .attr("font-style", "bold")
      .attr("x", d => xScale(d.poverty))
      .attr("y", d => yScale(d.healthcare));
    // 3.5 Tool tip and tool tip event listeners
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -30])
    .html(function(d) {
      return (`<br>Poverty: ${d.poverty}<br>w/o Healthcare: ${d.healthcare}`);
    });
    // Create tooltip in the chart
    chartGroup.call(toolTip);
    // Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });
    // 3.6 Create Y axis label
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", margin - 100)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .attr("font-style", "bold")
    .text("In Poverty (%)");
  chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top})`)
    .attr("class", "axisText")
    .attr("font-style", "bold")
    .text("Without Healthcare (%)");
  }).catch(function(error) {
      console.log(error);
      });
