const dagre = require('dagre');

function parse(graph) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    ranker: 'longest-path',
  });
  g.setDefaultEdgeLabel(() => ({}));

  let { nodes, relations } = graph;
  nodes = nodes || [];
  relations = relations || [];
  nodes.forEach((node) => {
    if (node.type === 'start' || node.type === 'stop') {
      g.setNode(node.id, { width: 72, height: 72 });
    } else {
      g.setNode(node.id, { width: 72, height: 72 });
    }
  });
  relations.forEach((relation) => {
    const { from, to } = relation;
    g.setEdge(from, to);
  });
  dagre.layout(g);
  nodes = g.nodes()
    .map(node => ({ item: nodes.find(item => `${item.id}` === `${node}`), position: g.node(node) }));

  const lines = g.edges().map((e) => {
    const relation = relations
      .find(item => item.from === e.v && item.to === e.w);
    return {
      ...g.edge(e), from: e.v, to: e.w, ...relation,
    };
  });

  console.log('width', g.graph().width);
  console.log('height', g.graph().height);

  return {
    nodes,
    lines,
    width: g.graph().width,
    height: g.graph().height,
  };
}

export { parse };
