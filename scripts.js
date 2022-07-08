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

    function getQuarter(date) {
      switch (date.getMonth()) {
        case 2:
          return "Q1";
          break;
        case 5:
          return "Q2";
          break;
        case 8:
          return "Q3";
          break;
        case 11:
          return "Q4";
          break;
      }
    }

    const w = 800;
    const h = 400;
    const margin = { top: 40, right: 40, bottom: 40, left: 45 };
    const innerWidth = w - margin.left - margin.right;
    const innerHeight = h - margin.top - margin.bottom;

    console.log(dataset);
    console.log(dataset.length);

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(dataset, (d) => new Date(d[0])))
      .range([margin.left, w - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, (d) => d[1] + 2000)])
      .range([h - margin.bottom, margin.top]);

    const svg = d3
      .select("#graph")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltip")
      .style("opacity", 0);

    d3.select("svg")
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(new Date(d[0])))
      .attr("y", (d) => yScale(d[1]))
      .attr("width", 3)
      .attr("height", (d) => yScale(0) - yScale(d[1]))
      .attr("fill", "seagreen")
      .attr("class", "bar")
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])
      .on("mouseover", function (d, i) {
        tooltip
          .html(
            new Date(i[0]).getFullYear() +
              "-" +
              getQuarter(new Date(i[0])) +
              "<br>" +
              i[1] +
              " Billion"
          )
          .attr("data-date", i[0])
          .style("left", event.pageX + 5 + "px")
          .style("top", event.pageY - 50 + "px");
        tooltip.style("opacity", 0.9);
        tooltip.attr("id", "tooltip");
        tooltip.style("fill", "red");
        var colorChange = d3.select(this);
        colorChange.style("fill", "red");
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(0).style("fill", "seagreen");
        tooltip.style("opacity", 0);
      });

    /*svg.selectAll("text")
       .data(dataset)
       .enter()
       .append("text")
       .text((d) =>  (d[0] + "," + d[1]))
       .attr("x", (d) => xScale(d[0] + 10))
       .attr("y", (d) => yScale(d[1]))*/

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(10);
    const yAxisGrid = d3
      .axisLeft(yScale)
      .tickSize(-innerWidth - 3)
      .tickFormat("")
      .ticks(10);

    svg
      .append("g")
      .attr("class", "y-axis-grid")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxisGrid)
      .style("opacity", 0.2);

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${h - margin.bottom})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis);
  };
});
