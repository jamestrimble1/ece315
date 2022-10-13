// With JQuery
$("#vin_b").slider({
	reversed : false
});

$("#vin_a").slider({
	reversed : false
});

$("#vin_f").slider({
	reversed : false
});

$("#vin_p").slider({
	reversed : false
});


var ViewModel = {
    
    vin_a: ko.observable(10),
    vin_b: ko.observable(0),
    vin_f: ko.observable(5),
    vin_p: ko.observable(0)  

};

ViewModel.vin_chart = ko.computed(function() {
    var chart = document.getElementById('graph-vin');
    var a = Number(ViewModel.vin_a());
    var f = Number(ViewModel.vin_f());
    var b = Number(ViewModel.vin_b());
    var p = Number(ViewModel.vin_p());
    
    var xValues = [];
    var yValues = [];
    var vmaxValues = [];
    var vminValues = [];
    
    for (var i = 0; i < 3000; i++) {
        dt = 1/3000;
        xValues[i] = i*dt;
        yValues[i] = b+a*Math.cos((Math.PI/180)*(360*f*(i*dt)-p));
    }
    
    Plotly.newPlot( chart, [{
	x: xValues,
	y: yValues,
   
     }], {
	margin: { t: 0 },
    xaxis: {
        anchor: "x",
        autorange: false,
        range: [0, 1],
        title: "t, s"
    },
yaxis: {
    anchor: "y", 
    autorange: false,
    range: [-20,20],
    title: "V(t), V"
  }
 } );
});

ko.applyBindings(ViewModel);
