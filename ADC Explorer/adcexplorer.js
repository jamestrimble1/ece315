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

$("#adc_vmax").slider({
	reversed : false
});

$("#adc_vmin").slider({
	reversed : false
});

$("#adc_b").slider({
	reversed : false
});

$("#adc_fs").slider({
	reversed : false
});



var ViewModel = {
    
    vin_a: ko.observable(5),
    vin_b: ko.observable(5),
    vin_f: ko.observable(10),
    vin_p: ko.observable(0),    
    
    adc_vmax: ko.observable(10),
    adc_vmin: ko.observable(0),
    adc_fs: ko.observable(100),
    adc_b: ko.observable(4)    
};

ViewModel.aliasing = ko.computed(function() {
   return  Number(ViewModel.adc_fs()) <= 2*Number(ViewModel.vin_f());
});

ViewModel.clipping = ko.computed(function() {
   return  ((Number(ViewModel.vin_b())+Math.abs(Number(ViewModel.vin_a()))) > Number(ViewModel.adc_vmax()) 
        || (Number(ViewModel.vin_b())-Math.abs(Number(ViewModel.vin_a()))) < Number(ViewModel.adc_vmin()));
});

ViewModel.adc_resolution = ko.computed(function() {
    return ((Number(ViewModel.adc_vmax())-Number(ViewModel.adc_vmin()))/Math.pow(2,Number(ViewModel.adc_b())));
})

ViewModel.vout_chart = ko.computed(function() {
    var chart = document.getElementById('graph-vout');
var a = Number(ViewModel.vin_a());
    var f = Number(ViewModel.vin_f());
    var b = Number(ViewModel.vin_b());
    var p = Number(ViewModel.vin_p());
    var adc_fs = Number(ViewModel.adc_fs());
    var adc_b = Number(ViewModel.adc_b());
    var adc_vmax = Number(ViewModel.adc_vmax());
    var adc_vmin = Number(ViewModel.adc_vmin());
    var adc_resolution = Number(ViewModel.adc_resolution());
    
    var xValues = [];
    var yValues = [];
    var vmaxValues = [];
    var vminValues = [];
    
    t = 0;
    dt_s = 1/adc_fs;
    nextChange = dt_s;
    
    for (var i = 0; i < 3000; i++) {
        dt = 1/3000;        
                
        
        
        if (i*dt >= nextChange) {
            nextChange = nextChange + dt_s;
            t = i;
        }
            
        xValues[i] = i*dt;                        
        // Sample
        yValues[i] = b+a*Math.cos(2*Math.PI*f*(t*dt) +p);
        if (yValues[i] > adc_vmax) {
            yValues[i] = adc_vmax;
        } else if (yValues[i] < adc_vmin) {
            yValues[i] = adc_vmin;
        }
        // Quantize
        el = (yValues[i] - adc_vmin)/adc_resolution;
        ql = Math.floor(el);
        if (ql >= Math.pow(2, adc_b)) { ql = Math.pow(2, adc_b) - 1; }
        
        // Encode // Change level to binary - not necessary
        
        // Convert the quantized level to a scaled 5V output
        yValues[i] = (ql/(Math.pow(2,adc_b)))*5;                
        
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
    range: [-1, 7], 
    title: "Vout, V"
  }
 } );
})

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
        yValues[i] = b+a*Math.cos(2*Math.PI*f*(i*dt)+p);
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
    range: [-15, 25], 
    title: "Vin, V"
  }
 } );
});

ko.applyBindings(ViewModel);
