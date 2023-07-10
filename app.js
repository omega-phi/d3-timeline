// import * as d3 from 'd3'

var g_svg;
var data;
var width;
var height;

export function chart(sorting,dataByRegion,p_data,d3,color,DOM,p_width,p_height,margin,createTooltip,y,getTooltipContent,axisTop,axisBottom)
{
  data = p_data
  width = p_width
  height = p_height
  g_svg = DOM
  console.log('hello chart!!!')
  let filteredData;
  if(sorting !== "time") {
    filteredData = [].concat.apply([], dataByRegion.map(d=>d.values));
  } else { 
    filteredData = data.sort((a,b)=>  a.start-b.start);
  }

  filteredData.forEach(d=> d.color = d3.color(color(d.region)))

  console.log(filteredData)

  parent = this; 
  if (!parent) {
    parent = document.createElement("div");
    //document.createElement("svg")
    // const svg = d3.select(DOM.svg(width, height));
    const svg = DOM;
    //const svg = d3.select("svg");

    const g = svg.append("g").attr("transform", (d,i)=>`translate(${margin.left} ${margin.top})`);

    const groups = g
      .selectAll("g")
      .data(filteredData)
      .enter()
      .append("g")
      .attr("class", "civ")


    const tooltip = d3.select(document.createElement("div")).call(createTooltip);

    const line = svg.append("line").attr("y1", margin.top-10).attr("y2", height-margin.bottom).attr("stroke", "rgba(0,0,0,0.2)").style("pointer-events","none");

    groups.attr("transform", (d,i)=>`translate(0 ${y(i)})`)

    console.log(groups)

    groups
      .each(function (d) {
        console.log(d)
        const x = d3.scaleLinear()
            .domain([d3.min(data, d => d.start), d3.max(data, d => d.end)])
            .range([0, width - 30 - 30])
          
        const y = d3.scaleBand()
            .domain(d3.range(data.length))
            .range([0,height - 30 - 30])
            .padding(0.2)
      
        console.log(this)
        const el = d3.select(this);
        const sx = x(d.start);
        const w = x(d.end) - x(d.start);
        const isLabelRight =(sx > width/2 ? sx+w < width : sx-w>0);
      
        el.style("cursor", "pointer")
      
        el
          .append("rect")
          .attr("x", sx)
          .attr("height", y.bandwidth())
          .attr("width", w)
          .attr("fill", d.color);
      
        el
          .append("text")
          .text(d.civilization)
          .attr("x",isLabelRight ? sx-5 : sx+w+5)
          .attr("y", 2.5)
          .attr("fill", "black")
          .style("text-anchor", isLabelRight ? "end" : "start")
          .style("dominant-baseline", "hanging");
      })
      .on("mouseover", function(d) {
        console.log(this)
        d3.select(this).select("rect").attr("fill", d.color.darker())

        tooltip
          .style("opacity", 1)
          .html(getTooltipContent(d))
      })
      .on("mouseleave", function(d) {
        d3.select(this).select("rect").attr("fill", d.color)
        tooltip.style("opacity", 0)
      })


    svg
      .append("g")
      .attr("transform", (d,i)=>`translate(${margin.left} ${margin.top-10})`)
      .call(axisTop)

    svg
      .append("g")
      .attr("transform", (d,i)=>`translate(${margin.left} ${height-margin.bottom})`)
      .call(axisBottom)



    svg.on("mousemove", function(d) {

      let [x,y] = d3.mouse(this);
      line.attr("transform", `translate(${x} 0)`);
      y +=20;
      if(x>width/2) x-= 100;

      tooltip
        .style("left", x + "px")
        .style("top", y + "px")
    })

    parent.appendChild(svg.node());
    parent.appendChild(tooltip.node());
    parent.groups = groups;

  } else {


    const civs = d3.selectAll(".civ")

    civs.data(filteredData, d=>d.civilization)
      .transition()
      // .delay((d,i)=>i*10)
      .ease(d3.easeCubic)
      .attr("transform", (d,i)=>`translate(0 ${y(i)})`)


  }
  return parent

}
