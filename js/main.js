var wolfman = {

  elements: {},
  hold: {},

  setUp: function(){
    wolfman.hold.height = document.documentElement.clientHeight;
    wolfman.hold.totalHeight = document.documentElement.clientHeight * 2;
    wolfman.elements.container = document.getElementsByClassName("container")[0];
    wolfman.elements.vis = document.getElementsByClassName("vis")[0];

    wolfman.positionElements();
    wolfman.goD3();
    wolfman.bindListeners();
  },

  positionElements: function(){
    wolfman.elements.container.style.height = wolfman.hold.totalHeight + "px";
    wolfman.elements.vis.style.height = wolfman.hold.totalHeight / 4 + "px";
    wolfman.elements.vis.style.top = wolfman.hold.totalHeight * .5 + "px";
  },

  goD3: function(){
    var visHoursYOffset = 190;
    wolfman.hold.visHoursYPos =  wolfman.hold.totalHeight * .5 + 190;

    console.log(wolfman.data);
    var gVis = d3.select(".vis")
      .append("svg")
        .attr("width", '100%')
        .attr("height", '100%')
        .append("g")
          .attr("class","gVis"); //will need to change name to be more specific if there is multiple vis

    gVis.selectAll("text")
      .data(wolfman.data)
      .enter()
      .append("text")
        .attr("class","vis-hours")
        .attr("transform", "translate(190, "+ visHoursYOffset +")")
        .text(function(d){
            return 0;
          }
        );

    //wolfman.elements.gVis = gVis;
    wolfman.hold.visHoursActive = false;
    console.log(wolfman.hold.visHoursYPos);
    //console.log(gVis);
  },

  bindListeners: function(){
    $( window ).scroll(function(){
      var scroll = $( 'body' ).scrollTop() + wolfman.hold.height;
      console.log(scroll);
      if(scroll > wolfman.hold.visHoursYPos && !wolfman.hold.visHoursActive){
        wolfman.hold.visHoursActive = true;
        wolfman.updateVis();
      }
    });
  },

  updateVis: function(){
    d3.select(".gVis").selectAll("text")
      .data(wolfman.data)
      .transition("ease")
      .duration(1500)
      .tween( 'text', function(d) {
          // get current value as starting point for tween animation
          var currentValue = +this.textContent;
          // create interpolator and do not show nasty floating numbers
          var interpolator = d3.interpolateRound( currentValue, d.hours );

          // this returned function will be called a couple
          // of times to animate anything you want inside
          // of your custom tween
          return function( t ) {
            // set new value to current text element
            this.textContent = interpolator( t );
          };
      })
      .each("end", wolfman.addAdditionalInfo);
  },

  addAdditionalInfo: function(){
    d3.select(this)
      .data(wolfman.data)
      .append("tspan")
        .attr("class", "add-text")
        .attr("opacity", 0)
        .text(function(d){return " " + d.addText;})
        .transition()
          .duration(1000)
          .attr("opacity", 1);
      //.text(function(d){
      //  return this.textContent + " " d.addText;
      //});
  },


  data: [
    {
      "hours": 1200,
      "addText": "combined hours to date",
    }
  ]

};
