document.addEventListener("DOMContentLoaded", function () {
  const req = new XMLHttpRequest();
  req.open(
    "GET",
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
    true
  );
  req.send();
  req.onload = function () {
    const json = JSON.parse(req.responseText);
    let dataset = json.data;

    const w = 800;
    const h = 400;

    console.log(dataset)
    console.log(dataset.length)

    const xScale = d3.scaleTime()
      .domain(d3.extent(dataset, (d) => new Date(d[0])))
      .range([40, w - 40]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, (d) => d[1] + 20)])
      .range([h - 40, 40]);

    const svg = d3.select("#graph")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    d3.select("svg")
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(new Date(d[0])))
      .attr("y", (d) => yScale(d[1]))
      .attr("width", 1)
      .attr("height", (d) => yScale(0) - yScale(d[1]))
      .attr("fill", "seagreen")
      .attr("class", "bar")
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])


    d3.selectAll("rect")
      .append("title")
      .attr("id", "tooltip")
      .attr("data-date", (d) => d[0])
      .text((d) => `${d[0]} - $ ${d[1]}`)


    /*svg.selectAll("text")
       .data(dataset)
       .enter()
       .append("text")
       .text((d) =>  (d[0] + "," + d[1]))
       .attr("x", (d) => xScale(d[0] + 10))
       .attr("y", (d) => yScale(d[1]))*/

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${h - 40})`)
      .call(xAxis);

    svg.append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${40}, 0)`)
      .call(yAxis);
  };
});
