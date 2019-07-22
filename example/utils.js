// old -> new
// {nodes:[],relations:[]} ==> {nodes:[], edges:[],libraries:[]}
import _ from 'lodash';
import * as layerLayout from './dagre';
import configs from './configs';
import * as FlowUtils from '$src/utils';

/**
 *
 * @param {*} graph
 *
 */
const old = {
  graph: {
    nodes: [
      {
        description: '', id: 'start-1', name: '', type: 'start',
      },
      {
        description: '0',
        id: 'action-0',
        name: '0',
        payload: {
          created: 1561971492000, description: '您好，我们是宜人贷平台，请问您是李先生吗？', id: 735, name: '0', quizgroupId: 376, recordingIdsList: [], recordingList: [], recordingPaths: [], textTts: '您好，我们是宜人贷平台，请问您是李先生吗？', textTtsList: [], updated: 1562052426000, variableId: 197,
        },
        type: 'action',
      },
    ],
    relations: [
      {
        description: '', from: 'start-1', label: '', priority: 0, to: 'action-0',
      },
      {
        description: '',
        from: 'action-0',
        label: '',
        priority: 1,
        to: 'action-1',
        when: {
          left: { name: 'bianhao_109', type: 'variable' }, operator: 'eq', right: { raw: '"0"', type: 'literal', value: '0' }, type: 'expression',
        },
      },
    ],
  },
};
const new2 = {
  ndoes: [
    {
      id: 'action-0',
      component: {},
      metadata: {
        x: 0,
        y: 0,
        name: '0',
        type: 'action',
        description: '0',
        payload: {
          created: 1561971492000, description: '您好，我们是宜人贷平台，请问您是李先生吗？', id: 735, name: '0', quizgroupId: 376, recordingIdsList: [], recordingList: [], recordingPaths: [], textTts: '您好，我们是宜人贷平台，请问您是李先生吗？', textTtsList: [], updated: 1562052426000, variableId: 197,
        },
        width: 72,
        height: 72,
        label: '',
      },
    },
  ],
  edges: [
    {
      from: { node: 'id', port: 'out' },
      to: { node: 'to.id', port: 'in' },
      // src: { node: from.id, port: 'out' },
      // tgt: { node: to.id, port: 'in' },
      metadata: {
        priority: 1,
        route: '0',
        when: '',
        name: '',
        description: '',
      },
    },
  ],
};
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
      metadata: {
        ...item.position,
      },
    }));
  }


  nodes = nodes.map((node) => {
    const {
      metadata, name, id, description, type, payload,
    } = node;
    let x = 0;
    let y = 0;
    if (node.position) {
      x = node.position.x;
      y = node.position.y;
    }
    return {
      component: libraryMap[type],
      id,
      metadata: {
        x,
        y,
        width: 72,
        height: 72,
        ...metadata,
        label: node.name || node.id,
        name,
        description,
        payload,
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

    const {
      when, name, description, priority, metadata,
    } = item;

    return {
      from: { node: from.id, port: 'out' },
      to: { node: to.id, port: 'in' },
      // src: { node: from.id, port: 'out' },
      // tgt: { node: to.id, port: 'in' },
      metadata: {
        route: '0',
        when,
        name,
        description,
        priority,
        ...metadata,
      },
    };
  });

  const lines = FlowUtils.buildLines({ edges, nodeMap: newNodeMap }, { nodeWidth: 72, nodeHeight: 72 });

  const r = {
    nodeMap: newNodeMap,
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
  let { nodes, edges } = graph;
  nodes = nodes.map((item) => {
    const { id, metadata, component } = item;
    const {
      x, y, name, description, payload, width, height,
    } = metadata;
    return {
      id,
      name,
      description,
      type: component.name,
      payload,
      metadata: {
        x,
        y,
        width,
        height,
      },
    };
  });

  edges = edges.map((item) => {
    const { from, to, metadata } = item;
    const {
      route, when, name, description, priority,
    } = metadata;
    return {
      from: from.node,
      to: to.node,
      label: name,
      description,
      priority,
      when,
      metadata: {
        route,
      },
    };
  });
  return { nodes, relations: edges };
}

export {
  wrapScenario,
  unwrapToScenario,
};
