// @TODO: YOUR CODE HERE!
//define SVG area dimensions
var svgWidth = 1000;
var svgHeight = 600;

//define the charts margins as an object
var chartMargin = {
    top: 50,
    right: 50,
    bottom: 125,
    left: 125,
};

//define dimensions of the chart area 
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

//select body, append svg area to it, and set the dimensions
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

//append a group to the SVG area and shift it to the right and down to adhere to the margins 
//set in the chartMargin obeject
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

//load data from csv
d3.csv("./assets/data/data.csv").then(function(dataTrends) {
    //console.log(dataTrends);
    
    //parse data 
    dataTrends.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.income = +data.income;
    });

//linear scales 
var yScale = d3.scaleLinear()
    .domain([d3.min(dataTrends, d => d.income) -1, d3.max(dataTrends, d => d.income) +1])
    .range([chartHeight, 0]);

var xScale = d3.scaleLinear()
    .domain([d3.min(dataTrends, d => d.obesity) -2, d3.max(dataTrends, d => d.obesity) +2])
    .range([0, chartWidth]);

//create axes
var yAxis = d3.axisLeft(yScale);
var xAxis = d3.axisBottom(xScale);

//set x to the bottom of the chart
chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(xAxis);

//set y to the y axis
chartGroup.append("g")
    .call(yAxis);

//create circles and add text 
var circlesGroup = chartGroup.selectAll("circle")
    .data(dataTrends)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.obesity))
    .attr("cy", d => yScale(d.income))
    .attr("r", "15")
    .attr("opacity", ".65")
    .classed("stateCircle", true);


chartGroup.selectAll("text")
    .data(dataTrends)
    .enter()
    .append("text")
    .attr("x", d => xScale(d.obesity))
    .attr("y", d => yScale(d.income))
    .classed("stateText", true)
    .text(d => d.abbr)

// create axes labels
chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - chartMargin.left + 40)
  .attr("x", 0 - (chartHeight / 2))
  .attr("dy", "1em")
  .attr("class", "aText")
  .text("Income");

chartGroup.append("text")
  .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top + 30})`)
  .attr("class", "aText")
  .text("Obesity (%)");


}).catch(function(error) {
    console.log(error);
    
});