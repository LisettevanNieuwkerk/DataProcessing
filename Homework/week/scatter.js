// WILDCARD
//Name: Lisette van Nieuwkerk
//Studentnumber: 10590919
//Purpose: Find a relation between the Purchasing Power Parities, inbound arrivals and GDP 

// Function to calculate min and max
function minMax(data, i) {
  var current;
  var max;
  var min;
  var first = true;

  for (c in data) {
    current = data[c][i];
    if (first == true) {
      max = current;
      min = current;
      first = false;
    }
    else {
      if (current > max) {
        max = current;
      }
      else if (current < min) {
        min = current;
      }
    }
  }
  return [min, max];
}


// Function to get datapoint
function getDataPoint(response, key, time, year) {
  for (i in response[key]) {
    if (response[key][i][time] == year) {
      return response[key][i]['Datapoint'];
    }
  }
}


function updateYear(newYear, response, svg, color, tooltip, xScale, yScale) {
  // Put usable data into object
  var data = [];
  for (key in response[0]) {
    if (key in response[1] && key in response[2]) {
      var country = {};
      country['Country'] = key;
      country['PPP'] = getDataPoint(response[0], key, 'Time', newYear);
      country['TourismeInbound'] = getDataPoint(response[1], key, 'Time', newYear);
      country['GDP'] = getDataPoint(response[2], key, 'Year', newYear);
      data.push(country);
    }
  }

  // Remove undefined values
  for (i in data) {
    if (data[i]['PPP'] == null || data[i]['TourismeInbound'] == null
  || data[i]['GDP'] == null) {
      data.splice(i, 1);
    }
  }

  // Calculate min and max of data
  var domainPpp = minMax(data, 'PPP');
  var domainArrival = minMax(data, 'TourismeInbound');
  var domainGdp = minMax(data, 'GDP');
  //console.log(domainPpp, domainArrival, domainGdp);

  // Create scatterplot
  var c = svg.selectAll("circle")
         .data(data)

  c.enter()
         .append("circle")
         .attr("class", "circles")
         // Append mouse over tip
         .on("mouseover", function(d) {
           tooltip.transition()
                .duration(200)
                .style("opacity", .9);
           tooltip.html(d.Country)
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
         })
         .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
         })
         // Create dots
         .merge(c)
         .transition()
         .duration(1000)
         .attr("cx", function (d) {
              return xScale(d.TourismeInbound);
          })
         .attr("cy", function(d) {
              return yScale(d.PPP);
         })
         .attr("r", 5)
         // Depend color on GDP
         .style("fill", function (d) {
            if (d.GDP <= 100000) {
                return color.range()[0];
            }
            else if (d.GDP > 100000 && d.GDP < 100000000) {
                return color.range()[1];
            }
            else if (d.GDP > 100000000) {
                return color.range()[2];
            }
         });
}


window.onload = function() {
  // Get URL
  const tourismInbound = "https://data.mprog.nl/course/10%20Homework/100%20D3%20Scatterplot/datasets/tourists.json"
  const gdpData = "https://data.mprog.nl/course/10%20Homework/100%20D3%20Scatterplot/datasets/gdp.json"
  const purchasingPowerParities = "https://data.mprog.nl/course/10%20Homework/100%20D3%20Scatterplot/datasets/ppp.json"

  // Fetch requests
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  var ppp = fetch(proxyurl + purchasingPowerParities)
  .then(function(response) {
    return response.json();
  })
  .catch(() => console.log("error"));

  var tourism = fetch(proxyurl + tourismInbound)
  .then(function(response) {
    return response.json();
  })
  .catch(() => console.log("error"));

  var gdp = fetch(proxyurl + gdpData)
  .then(function(response) {
    return response.json();
  })
  .catch(() => console.log("error"));

  var requests = [ppp, tourism, gdp];

  Promise.all(requests).then(function(response) {
      // Draw SVG figure
      var width = 970;
      var height = 700;
      var svg = d3.select("body").append("svg")
                .attr("width", width)
                .attr("height", height);

      // Color scale for GDP
      var color = d3.scaleOrdinal()
      .domain(['>= $100.000', '< $100.000', '< $1.000.000.000'])
      .range(['#e41a1c','#377eb8','#4daf4a']);

      // Create tooltip
      var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

      //Size scatterplot
      var paddingRight = 950;
      var paddingLeft = 40;
      var paddingBottom = 650;
      var paddingTop = 10;

      // Define scale and axis for y and x
      var yScale = d3.scaleLinear()
                      .domain([-10, 880])
                      .range([paddingBottom, paddingTop]);
      var yAxis = d3.axisLeft(yScale);

      var xScale = d3.scaleLinear()
                      .domain([0, 210000000])
                      .range([paddingLeft, paddingRight]);
      var xAxis = d3.axisBottom(xScale);

      // Draw y and x axis
      svg.append("g")
           .call(yAxis)
           .attr("transform","translate("+ paddingLeft +", 0)")

      svg.append("g")
           .call(xAxis)
           .attr("transform","translate(0, "+ paddingBottom +")")

      // Append x and y label
      svg.append("text")
           .attr("class", "labels")
           .attr("transform","translate(750, 690)")
           .text("Total number of inbound arrivals");

     svg.append("text")
          .attr("class", "labels")
          .attr("transform", "translate(45, 20)")
          .text("PPP");

      // Append title
      svg.append("text")
          .attr("class", "title")
          .attr("transform","translate(250, 25)")
          .text("The relation between the Purchasing Power Parities, inbound arrivals and GDP");

      // Create legend
      // Source: https://www.competa.com/blog/d3-js-part-7-of-9-adding-a-legend-to-explain-the-data/
      var xLegend = 800;
      var legend = svg.selectAll(".legend")
                      .data(color.domain())
                      .enter()
                      .append("g")
                      .attr("transform", function(d, i) {
                        var height = 23;
                        var y = (i * height) + 50;
                        return "translate(" + xLegend + "," + y + ")";
                    });

      legend.append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color)
      .style("stroke", "black");

      legend.append('text')
          .attr("class", "labels")
          .attr("x", 23)
          .attr("y", 13)
          .text(function(d) { return d; });

      // Legend description
      svg.append("text")
           .attr("class", "labels")
           .attr("transform","translate("+ xLegend +", 140)")
           .text("GDP in $");

     // Create first scatterplot for 2016
     updateYear("2016", response, svg, color, tooltip, xScale, yScale);

     // Adapt scatteplot to year
     d3.select('#year')
       .on('change', function() {
         var newYear = eval(d3.select(this).property('value'));
         updateYear((newYear.toString()), response, svg, color, tooltip, xScale, yScale);
     });

  }).catch(function(e){
      throw(e);
  });
};
