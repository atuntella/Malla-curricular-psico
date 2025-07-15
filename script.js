
const datos = [{"año":1,"periodo":1,"materias":[{"id":"72f24894-14ec-4402-825d-b128c9a9cd93","nombre":"Introducción a la Psicología ","tipo":"ninguno","requisitos":[]}]}];

const materiasMap = new Map();
const nodes = [];
const links = [];

datos.forEach(bloque => {
  bloque.materias.forEach(m => {
    nodes.push({ id: m.id, nombre: m.nombre });
    materiasMap.set(m.id, m.nombre);
    m.requisitos.forEach(rid => {
      links.push({ source: rid, target: m.id });
    });
  });
});

const svg = d3.select("svg");
const width = window.innerWidth;
const height = window.innerHeight;

const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(100))
  .force("charge", d3.forceManyBody().strength(-300))
  .force("center", d3.forceCenter(width / 2, height / 2));

const link = svg.append("g")
  .selectAll("line")
  .data(links)
  .join("line");

const node = svg.append("g")
  .selectAll("circle")
  .data(nodes)
  .join("circle")
  .attr("r", 10)
  .call(drag(simulation));

const label = svg.append("g")
  .selectAll("text")
  .data(nodes)
  .join("text")
  .text(d => d.nombre)
  .attr("x", 12)
  .attr("dy", "0.35em");

simulation.on("tick", () => {
  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  node
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);

  label
    .attr("x", d => d.x + 12)
    .attr("y", d => d.y);
});

function drag(simulation) {
  return d3.drag()
    .on("start", event => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    })
    .on("drag", event => {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    })
    .on("end", event => {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    });
}
