//Name: Lisette van Nieuwkerk
//Studentnumber: 10590919
//Purpose
var fileName = "data.json";


// Draw barChart
function barChart(dataset, country) {

  // Define min and max values
  //max = d3.max(values);
  //min = d3.min(values);

  var i = 0;
  // Draw bars
  svg.selectAll("rect")
     .data(dataset)
     .enter()
     .append("rect")
     .attr("class", "bar")
     // Insert interactive element
     // https://bl.ocks.org/alandunning/274bf248fd0f362d64674920e85c1eb7
     .on("mousemove", function(d){
       if (d.LOCATION == country) {
         if ((d.INDICATOR == "IW_HADI" || d.INDICATOR == "IW_HNFW" || d.INDICATOR == "JE_PEARN") && d.Inequality == "Total"){
            tip.style("left", d3v5.event.pageX - 50 + "px")
                .style("top", d3v5.event.pageY - 70 + "px")
                .style("display", "inline-block")
                .html(d.Indicator + '<br>'+ d.Value );
        }
      }
    })
     .on("mouseout", function(d){ tip.style("display", "none");})
     .merge(svg)
     .transition()
     .duration(1000)
     .attr("x", function(d){
       if (d.LOCATION == country) {
         if ((d.INDICATOR == "IW_HADI" || d.INDICATOR == "IW_HNFW" || d.INDICATOR == "JE_PEARN") && d.Inequality == "Total"){
             return xScale(d.Indicator) ;
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
     .attr("width", (widthChart / 4) - 10)
     .attr("height", function(d) {
       if (d.LOCATION == country) {
         if ((d.INDICATOR == "IW_HADI" || d.INDICATOR == "IW_HNFW" || d.INDICATOR == "JE_PEARN") && d.Inequality == "Total"){
             return  heightChart - yScale(d.Value);
           }
         }

      });

     svg.exit().remove();
}


// Set colours
function count(dataset) {
  var countries = {};
  var  color;
  for (i in dataset) {
    if (dataset[i].INDICATOR == "SW_LIFS") {

       if (dataset[i].Value < 5.5) {
          color = '#123456';
       }
       else if (dataset[i].Value >= 5.5 && dataset[i].Value < 7.0) {
         color = 'blue';
       }
       else {
          color = '#afafaf';
       }

      countries[dataset[i].LOCATION] =  {numberOfThings : dataset[i].Value, fillColor : color};
    }
  }
  return countries;
}



// drawMap
function drawMap(dataset) {
  var basic = new Datamap({
    element: document.getElementById("container"),
    fills: { defaultFill: 'green' },
    data: count(dataset),
    geographyConfig: {
    // show desired information in tooltip
      popupTemplate: function(i, data) {
          // don't show tooltip if country don't present in dataset
          if (!data) { return ['<div class="hoverinfo">',
              '<strong>No data</strong>',
              '<br>Country: <strong>'+ i.properties.name +'</strong>',
              '</div>'].join('') };
          // tooltip content
          return ['<div class="hoverinfo">',
              '<strong>hoi</strong>',
              '<br>Count: <strong>hoi</strong>',
              '</div>'].join('');
          }
      },
  });

}


window.onload = function() {

  d3v5.json(fileName).then(function(dataset) {

    // Draw svg figure
    var width = 950;
    var height = 500;
    var svg = d3v5.select("body").append("svg")
              .attr("width", width)
              .attr("height", height);

    // Define scale and axis for y and x
    var widthChart = 900;
    var heightChart = 440;
    var barPadding = 1;
    var maxDomain = 100;

    var yScale = d3v5.scaleLinear()
                    .domain([0, 100000])
                    .range([heightChart, 0]);
    var yAxis = d3v5.axisLeft(yScale)
                    .ticks(9);

    var xScale = d3v5.scaleBand()
                    .domain(dataset.map(function(d){
                      if (d.LOCATION == country) {
                        if ((d.INDICATOR == "IW_HADI" || d.INDICATOR == "IW_HNFW" || d.INDICATOR == "JE_PEARN") && d.Inequality == "Total") {
                            return d.Indicator;
                        }
                      }
                    }))
                    .range([0, widthChart]);
    var xAxis = d3v5.axisBottom(xScale);

    // Draw y and x axis
     svg.append("g")
        .attr("class", "axis")
        .attr("class", "Yaxis")
        .attr("transform", "translate(50, 10)")
        .call(yAxis);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 70)
        .style("text-anchor", "end")
        .text("USD");

    svg.append("g")
        .attr("class", "axis")
        .attr("class", "Xaxis")
        .attr("transform", "translate(50, 450)")
        .call(xAxis);

    // Add title
    svg.append("text")
        .attr("class", "title")
        .attr("transform","translate(475, 25)")
        .text("Total income, financial wealth and personal earnings");

    // Add interactive tip
    var tip = d3v5.select("body").append("div")
                  .attr("class", "tip");

    // drawmap
    drawMap(dataset);

    basic.on('map-click', function(event, data) {
       console.log(data;)
    });


  });


};
