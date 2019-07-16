// old -> new
// {nodes:[],relations:[]} ==> {nodes:[], edges:[],libraries:[]}
import _ from 'lodash';
import * as layerLayout from './dagre';
import configs from './configs';
import * as FlowUtils from './packages/flow-graph/utils';


function wrapScenario(graph) {
  console.log('wrapScenario', graph, configs);
  let { nodes, relations } = graph;
  const library = configs.components;
  const libraryMap = {};
  library.forEach((item) => {
    libraryMap[item.name] = item;
  });


  if (!_.get(nodes, '0.metadata.x')) {
    const parsed = layerLayout.parse(graph);
    nodes = parsed.nodes.map(item => ({
      ...item.item,
      position: item.position,
    }));
  }


  nodes = nodes.map((node) => {
    let x = 0;
    let y = 0;
    if (node.position) {
      x = node.position.x;
      y = node.position.y;
    }
    return {
      component: libraryMap[node.type],
      id: node.id,
      payload: node.payload,
      metadata: {
        x, y, width: 72, height: 72, label: node.name || node.id,
      },
    };
  });

  const newNodeMap = {};
  nodes.forEach((item) => {
    newNodeMap[item.id] = item;
  });

  const edges = relations.map((item) => {
    item.id = 1;
    const from = newNodeMap[item.from];
    const to = newNodeMap[item.to];
    const when = item.when;
    const name = item.name;
    const description = item.description;

    return {
      from: { node: from.id, port: 'out' },
      to: { node: to.id, port: 'in' },
      // src: { node: from.id, port: 'out' },
      // tgt: { node: to.id, port: 'in' },
      metadata: {
        route: '0', when, name, description,
      },
      when,
      name,
      description,
    };
  });

  const lines = FlowUtils.buildLines({ edges, nodeMap: newNodeMap }, { nodeWidth: 72, nodeHeight: 72 });

  const r = {
    nodes,
    edges,
    lines,
    library: configs.components,
  };
  return r;
}


// new->old
function unwrapToScenario(graph) {
  console.log('unwrapToScenario', graph);
}

export {
  wrapScenario,
  unwrapToScenario,
};
