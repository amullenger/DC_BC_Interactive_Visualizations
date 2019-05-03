
function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(`/metadata/${sample}`).then(function(sampleMetaData){
    var panel = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sampleMetaData).forEach(([key, value]) => {
      //console.log(`Key: ${key}, Value: ${value}`)
      var listItem = panel.append('p');
      listItem.text(`${key}: ${value}`);

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    });
  });    

    
}

function buildCharts(sample) {
  d3.json(`/samples/${sample}`).then(function(sampleData){
    console.log(sampleData);
    console.log(sampleData.otu_ids);

    var bubbleTrace = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      text: sampleData.otu_ids,
      mode: 'markers',
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids
      }
    };
    var bubbleLayout = {
      title: 'Sample Bubble Chart', 
      xaxis: {
        type: 'linear',
        title: 'OTU IDs'
      }, 
      yaxis: {
        type: 'linear'
      },
    };
    var bubbleData = [bubbleTrace];
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    var pieSamples = [];

    for (var i = 0; i < sampleData.sample_values.length; i++){
      pieSamples.push({'id': sampleData.otu_ids[i], 'value': sampleData.sample_values[i], 'label': sampleData.otu_labels[i]})
    };

    pieSamples.sort(function (first, second){
      return(second.value - first.value)
    });

    var topTenValues = pieSamples.slice(0,10);

    var pieTrace = {
      type: 'pie',
      values: topTenValues.map(d => d.value),
      labels: topTenValues.map(d => d.id),
      text: topTenValues.map(d => d.label),
      hoverinfo: 'text',
      textinfo: 'percent'
    };
    var pieData = [pieTrace];
    Plotly.newPlot("pie", pieData);
    
  });


  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
