//Name: Lisette van Nieuwkerk
//Studentnumber: 10590919
//Purpose: To investigate if there is a link between the average score of life satisfaction in countries
// and the financial situation of the people.
var fileName = "data.json";
var country = null;


/* Set values for countries*/
function valuesCountries(dataset) {
  var countries = {};
  var color;
  var i;

  for (i in dataset) {
    if (dataset[i].INDICATOR == "SW_LIFS") {
       if (dataset[i].Value < 5.5) {
          color = '#66c2a4';
       }
       else if (dataset[i].Value >= 5.5 && dataset[i].Value < 7.0) {
         color = '#2ca25f';
       }
       else {
          color = '#006d2c';
       }
      countries[dataset[i].LOCATION] =  {numberOfThings : dataset[i].Value, fillColor : color,
      country : dataset[i].Country}
    }
  }
  return countries;
}


/* Draw datamap */
function drawMap(dataset, chart) {
  var values;

  // Draw datamap
  var basic = new Datamap({
    element: document.getElementById("container"),
    fills: { defaultFill: '#b2e2e2' },
    borderColor: '#b2e2e2',
    // Get colors and values of country
    data: valuesCountries(dataset),
    geographyConfig: {
    // Show desired information in tooltip
      popupTemplate: function(i, data) {
        // Don't show tooltip if country not present in dataset
        if (!data) { return ['<div class="hoverinfo">',
            '<strong>No data available</strong>',
            '<br>Country: <strong>'+ i.properties.name +'</strong>',
            '</div>'].join('') };
        // Tooltip content
        value = data.numberOfThings;
        return ['<div class="hoverinfo">',
            'Life satisfaction: <strong>'+ value +'</strong>',
            '<br>Country: <strong>'+ i.properties.name +'</strong>',
            '</div>'].join('');
        }
    },
    // Draw barchart when clicked on country
    done: function(datamap) {
      datamap.svg.selectAll('.datamaps-subunit').on('click', function(geo) {
        values = valuesCountries(dataset)[geo.id];
        if (values != undefined) {
          barChart(dataset, geo.id, values, chart);
        }
      })
    }
  });
}


/* Function to draw legend */
function drawLegend(color) {
  // Draw svg figure for legen
  var width = 1183;
  var height = 30;
  var legend = d3v5.select("body").append("svg")
                  .attr("width", width)
                  .attr("height", height);

  // Append title
  legend.append('text')
        .attr("class", "labels")
        .attr("transform", "translate(50, 18)")
        .text("Average life satisfaction");

  // Append blocks
  var heightBlocks = 3;
  var sizeBlocks = 25;
  var legend = legend.selectAll("legend")
                    .data(color.domain())
                    .enter()
                    .append("g")
                    .attr("transform", function(d, i) {
                      var x = (i * 200) + 300;
                      return "translate(" + x + "," + heightBlocks + ")";
                    });

  legend.append("rect")
        .attr("width", sizeBlocks)
        .attr("height", sizeBlocks)
        .style("fill", color)
        .style("stroke", "black");

  // Append text
  legend.append('text')
        .attr("class", "labels")
        .attr("x", 40)
        .attr("y", 18)
        .text(function(d) { return d; });
}


/* Function to draw empty barchart */
function emptyChart() {
  // Draw SVG figure
  var width = 650;
  var height = 400;
  var svg = d3v5.select("body").append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("class", "chart");

  // Define scale and axis for y and x
  var topPadding = 380;
  var bottomPadding = 20;
  var paddingRight = 630;
  var paddingLeft = 50;
  var barPadding = 1;

  var yScale = d3v5.scaleLinear()
                  .domain([0, 200000])
                  .range([topPadding, bottomPadding]);

  var yAxis = d3v5.axisLeft(yScale)
                  .ticks(9);

  var xLabels = ["Household net adjusted disposable income", "Household net financial wealth", "Personal earnings"];
  var xScale = d3v5.scaleBand()
                  .domain(xLabels.map(function(label){
                    return label;
                  }))
                  .range([paddingLeft, paddingRight]);
  var xAxis = d3v5.axisBottom(xScale);

  // Add interactive tip
  var tip = d3v5.select("body").append("div")
                .attr("class", "tip");

  // Draw y and x-axis
   svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate("+ paddingLeft +", 0)")
      .call(yAxis);

  svg.append("text")
      .attr("class", "axis")
      .attr("transform", "rotate(-90)")
      .attr("y", 70)
      .style("text-anchor", "end")
      .text("USD");

  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0,"+ topPadding  +")")
      .call(xAxis);

  return [svg, xScale, yScale, tip];
}


/* Function to fill barchart */
function barChart(dataset, country, values, chart) {
  var svg = chart[0];
  var xScale = chart[1];
  var yScale = chart[2];
  var tip = chart[3];

  d3v5.selectAll(".title").remove();
  d3v5.selectAll(".subtitle").remove();

  // Add title barchart
  svg.append("text")
      .attr("class", "title")
      .attr("transform","translate(340, 25)")
      .text("Financial situation of " + values.country);

  svg.append("text")
      .attr("class", "subtitle")
      .attr("transform","translate(340, 50)")
      .text("Life satisfaction: " + values.numberOfThings);

  // Draw bars
  var finance;
  var bar = svg.selectAll("rect")
              .data(dataset)

  bar.enter()
     .append("rect")
     .attr("class", "bar")
     // Insert interactive element
     .on("mouseover", function(d) {
       tip.transition()
           .duration(200)
           .style("opacity", .9);
        tip.html('$' + d.Value)
           .style("left", d3v5.event.pageX - 50 + "px")
           .style("top", d3v5.event.pageY - 70 + "px");
    })
     .on("mouseout", function(d){
       tip.transition()
         .duration(200)
         .style("opacity", 0);
       })
     .merge(bar)
     .transition()
     .duration(1000)
     .attr("x", function(d){
       if (d.LOCATION == country) {
         if ((d.INDICATOR == "IW_HADI" || d.INDICATOR == "IW_HNFW" || d.INDICATOR == "JE_PEARN") && d.Inequality == "Total"){
             return xScale(d.Indicator) + 20;
        }
       }
      })
     .attr("y", function(d) {
        if (d.LOCATION == country) {
          if ((d.INDICATOR == "IW_HADI" || d.INDICATOR == "IW_HNFW" || d.INDICATOR == "JE_PEARN") && d.Inequality == "Total"){
              return  yScale(d.Value);
          }
        }
      })
     .attr("width", (580 / 3) - 50)
     .attr("height", function(d) {
       if (d.LOCATION == country) {
         if ((d.INDICATOR == "IW_HADI" || d.INDICATOR == "IW_HNFW" || d.INDICATOR == "JE_PEARN") && d.Inequality == "Total"){
             return  380 - yScale(d.Value);
           }
         }
      })
      .style("fill", values.fillColor);

}


window.onload = function() {

  d3v5.json(fileName).then(function(dataset) {
    // Set color scale
    var color = d3v5.scaleOrdinal()
    .domain(['No data', 'Lower than 5.5', 'Between 5.5 and 7.0', '7.0 or higher'])
    .range(['#b2e2e2','#66c2a4','#2ca25f', '#006d2c']);

    // Create empty datamap in document
    var datamap = document.createElement("div");
    datamap.setAttribute('id', 'container');
    datamap.setAttribute("style", "width: 1100x");
    datamap.setAttribute("style", "height: 600px");
    document.body.appendChild(datamap);

    // Draw legend of datamap
    drawLegend(color);

    // Draw empty barchart
    var chart = emptyChart();

    // drawmap
    drawMap(dataset, chart);

  });
};
