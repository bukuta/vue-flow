import _ from 'lodash';
// import { start } from 'repl';
import * as geometryutils from './geometryutils';

const result = {
  nodes: [
    {
      id: 'xx/yy_id',
      component: 'xxx/yyy',
      metadata: {
        x: 0,
        y: 0,
        width: 72,
        height: 72,
      },
      inports: [
        {
          name: 'in',
          label: 'in',
          route: '10',
          type: 'all',
          x: 0,
          y: 36,
        },
      ],
      outports: [
        {
          label: 'out',
          route: '10',
          type: 'all',
          x: 72,
          y: 36,
        },
      ],
    },
  ],
  groups: [
    {
      components: ['xx/yy_id', 'xx/yy_id'],
      metadata: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
    },
  ],
  edges: [
    {
      from: {
        node: 'dom/GetElement_f4nkd',
        port: 'element',
      },
      metadata: {
        route: '10',
      },
      to: {
        node: 'interaction/ListenMouse_1w3vt',
        port: 'element',
      },
    },
  ],
  library: {
    'core/Kick': {
      description: '',
      name: 'core/Kick',
      icon: 'cog',
      inports: [
        {
          name: 'data',
          type: 'all',
        },
        {
          name: 'in',
          type: 'all',
        },
      ],
      outports: [
        {
          name: 'out',
          type: 'all',
        },
      ],
    },
  },
};

const mockGraph = {
  imports: {
    name: {},
  },
  outports: {
    name: {},
  },
  nodeMap: {
    'xx/yy_123': {
      component: 'xx/yy',
      metadata: {
        x: 0,
        y: 0,
        label: 'xxx',
      },
    },
  },
  connections: [
    {
      data: 'data-1232',
      from: {
        node: 'xx/yy_123',
        port: 'portName',
      },
      to: {
        node: 'xx/yy_2222',
        port: 'portName',
      },
      meta: {
        route: '12',
      },
    },
    {
    },
  ],
  groups: [
    {
      name: 'elements',
      nodes: ['dom/GetElement_ah82a', 'dom/GetElement_f4nkd', 'dom/GetElement_z64xf', 'dom/GetElement_ah36i', 'core/Split_jzzu2'],
      metadata: {
        description: 'get the elements from the dom',
        color: 0,
      },
    },
    {

    },
  ],
};

function assambleGraph(graph, option = { nodeWidth: 72, nodeHeight: 72 }) {
  // nodes
  // edges
  // library

  const nodes = Object.entries(graph.nodeMap)
    .map(([id, item]) => ({
      ...item,
      id,
      name: item.component,
      metadata: {
        ...item.metadata,
        width: option.nodeWidth,
        height: option.nodeHeight,
      },
    }));

  const edges = graph.connections
    .filter(item => item.from && item.to)
    .map((edge) => {
      const from = _.get(edge, 'from.node');
      const to = _.get(edge, 'to.node');
      edge.from = { node: from, port: _.get(edge, 'from.port') };
      edge.to = { node: to, port: _.get(edge, 'to.port') };
      return edge;
    });

  const inports = graph.inports;
  const outports = graph.outports;

  const library = libraryFromGraph({
    nodes, edges, inports, outports,
  }, graph);

  console.log(library);

  console.log(inports, outports);

  const groups = groupRects({
    groups: graph.groups, inports, outports, nodes, nodeMap: graph.nodeMap,
  });


  // const lines = [];
  const lines = buildLines({ edges, nodeMap: graph.nodeMap }, option);
  return {
    nodes, groups, edges, library, lines, nodeMap: graph.nodeMap,
  };
}
function updateNode(graph, option = { nodeWidth: 72, nodeHeight: 72 }) {
  console.log('updateNode');
  const { nodes, edges } = graph;
  const nodeMap = {};
  nodes.forEach((item) => {
    nodeMap[item.id] = item;
  });
  const lines = buildLines({ edges, nodeMap }, option);
  return lines;
}


function buildLines(graph, option) {
  const lines = graph.edges
    .map(({
      from, metadata, to, data,
    }, index) => {
      if (from && from.node) {
        from.nodeElement = graph.nodeMap[from.node];
      }
      if (to && to.node) {
        to.nodeElement = graph.nodeMap[to.node];
      }

      const nodeSize = option.nodeWidth;
      const nodeHeight = option.nodeHeight;
      const nodeWidth = option.nodeWidth;

      let route = 0;
      if (metadata && metadata.route) {
        route = metadata.route;
      }

      const sourcePort = graph.nodeMap[from.node].component.outports[0];// getNodeOutport(graph, from.node, from.port, route, from.nodeElement.component, option);
      const targetPort = graph.nodeMap[to.node].component.inports[0];// getNodeInport(graph, to.node, to.port, route, to.nodeElement.component, option);


      // Organic / curved edge
      const soucePortPosition = _.get(sourcePort, 'position', 'right');
      const targetPortPosition = _.get(targetPort, 'position', 'left');
      let sourceX = 0;
      let sourceY = 0;
      let targetX = 0;
      let targetY = 0;

      switch (soucePortPosition) {
      case 'right':
        sourceX = _.get(from, 'nodeElement.metadata.x', 0) + _.get(from, 'nodeElement.metadata.width', nodeSize);
        sourceY = _.get(from, 'nodeElement.metadata.y', 0) + (sourcePort.y || nodeHeight / 2);
        break;
      case 'bottom':
        sourceX = _.get(from, 'nodeElement.metadata.x', 0) + (sourcePort.x || nodeWidth / 2);
        sourceY = _.get(from, 'nodeElement.metadata.y', 0) + _.get(from, 'nodeElement.metadata.height', nodeSize);
        break;
      default:
        break;
      }

      switch (targetPortPosition) {
      case 'left':
        targetX = _.get(to, 'nodeElement.metadata.x', 0);
        targetY = _.get(to, 'nodeElement.metadata.y', 0) + (targetPort.y || nodeHeight / 2);
        break;
      case 'top':
        targetX = _.get(to, 'nodeElement.metadata.x', 0) + (targetPort.x || nodeWidth / 2);
        targetY = _.get(to, 'nodeElement.metadata.y', 0);
        break;
      default:
        break;
      }

      return {
        ...buildLine({ x: sourceX, y: sourceY }, { x: targetX, y: targetY }, option),
        from,
        to,
      };
    });
  return lines;
}

function buildLine(startPosition, targetPosition, option = { nodeSize: 72 }) {
  const nodeSize = option.nodeWidth;

  const route = 0;

  // Organic / curved edge
  const sourceX = startPosition.x;
  const sourceY = startPosition.y;
  const targetX = targetPosition.x;
  const targetY = targetPosition.y;

  const CURVE = 50;

  let c1X;
  let c1Y;
  let c2X;
  let c2Y;
  if (targetY - 5 < sourceY) {
    const curveFactor = (sourceY - targetY) * CURVE / 200;
    if (Math.abs(targetX - sourceX) < nodeSize / 2) {
      // Loopback
      c1X = sourceX - curveFactor;
      c1Y = sourceY + curveFactor;
      c2X = targetX - curveFactor;
      c2Y = targetY - curveFactor;
    } else {
      // Stick out some
      c1X = sourceX + curveFactor;
      c1Y = sourceY + (targetY > sourceY ? curveFactor : -curveFactor);
      c2X = targetX - curveFactor;
      c2Y = targetY + (targetY > sourceY ? -curveFactor : curveFactor);
    }
  } else {
    // Controls halfway between
    c1X = sourceX;// + (targetX - sourceX) / 2;
    c1Y = sourceY + (targetY - sourceY) / 2;
    c2X = targetX;// - (targetX - sourceX) / 5;
    // c2Y = targetY;
    c2Y = sourceY + (targetY - sourceY) * 3 / 4;
  }

  // Make SVG path

  let path = createEdgePathArray(sourceX, sourceY, c1X, c1Y, c2X, c2Y, targetX, targetY);
  path = path.join(' ');

  const epsilon = 0.01;
  let center = findPointOnCubicBezier(0.5, sourceX, sourceY, c1X, c1Y, c2X, c2Y, targetX, targetY);
  function getShiftedPoint(epsilon) {
    return findPointOnCubicBezier(
      0.5 + epsilon, sourceX, sourceY, c1X, c1Y, c2X, c2Y, targetX, targetY,
    );
  }
  const plus = getShiftedPoint(epsilon);
  const minus = getShiftedPoint(-epsilon);
  const m = 1 * (plus[1] - minus[1]) / (plus[0] - minus[0]);
  const b = center[1] - (m * center[0]);

  // find point on line y = mx + b that is `offset` away from x,y


  let arrowLength = 12;
  // Which direction should arrow point
  if (plus[0] > minus[0]) {
    arrowLength *= -1;
  }
  center = findLinePoint(center[0], center[1], m, b, -1 * arrowLength / 2);

  // find points of perpendicular line length l centered at x,y

  const points = perpendicular(center[0], center[1], m, arrowLength * 0.9);
  // For m === 0, figure out if arrow should be straight up or down
  const flip = plus[1] > minus[1] ? -1 : 1;
  const arrowTip = findLinePoint(center[0], center[1], m, b, arrowLength, flip);
  points.push(arrowTip);

  const pointsArray = points.map(point => point.join(',')).join(' ');

  return {
    from: {},
    metadata: { route },
    to: {},
    data: null,
    path,
    points: pointsArray,
  };
}


function libraryFromGraph({
  nodes, edges, inports, outports,
}) {
  const components = {};
  const nodeComponents = {};

  nodes.forEach((node) => {
    const name = node.component;
    nodeComponents[node.id] = name;
    components[name] = {
      name,
      description: name,
      icon: 'cog',
      inports: [],
      outports: [],
    };
  });

  function addIfMissing(ports, name) {
    const found = ports.filter(p => p.name === name);
    if (found.length === 0) {
      ports.push({ name, type: 'all' });
    }
  }

  edges.forEach((edge) => {
    const to = nodeComponents[edge.to.node];
    addIfMissing(components[to].inports, edge.to.port);
    if (edge.from) {
      const from = nodeComponents[edge.from.node];
      addIfMissing(components[from].outports, edge.from.port);
    }
  });

  function componentsFromExports(exports, isInports) {
    Object.keys(exports).forEach((exportedName) => {
      const internal = exports[exportedName];
      const comp = components[nodeComponents[internal.node]];
      const ports = (isInports) ? comp.inports : comp.outports;
      addIfMissing(ports, internal.port);
    });
  }
  componentsFromExports(inports, true);
  componentsFromExports(outports, false);

  return components;
}

function collectPorts(nodes) {

}
function getPorts(graph, nodeName, componentName) {
  const node = graph.nodeMap[nodeName];

  let ports = null;// this.portInfo[nodeName];
  if (!ports) {
    const inports = {};
    const outports = {};
    if (componentName && graph.library) {
      // Copy ports from library object
      const component = graph.library[componentName];
      if (!component) {
        return {
          inports,
          outports,
        };
      }

      let i;
      let port;
      let len;
      for (i = 0, len = component.outports.length; i < len; i++) {
        port = component.outports[i];
        if (!port.name) { continue; }
        outports[port.name] = {
          label: port.name,
          type: port.type,
          x: node.metadata.width,
          y: node.metadata.height / (len + 1) * (i + 1),
        };
      }
      for (i = 0, len = component.inports.length; i < len; i++) {
        port = component.inports[i];
        if (!port.name) { continue; }
        inports[port.name] = {
          label: port.name,
          type: port.type,
          x: 0,
          y: node.metadata.height / (len + 1) * (i + 1),
        };
      }
    }
    ports = {
      inports,
      outports,
    };
    // this.portInfo[nodeName] = ports;
  }
  return ports;
}
function getNodeOutport(graph, nodeName, portName, route, componentName, option) {
  const ports = getPorts(graph, nodeName, componentName);
  if (!ports.outports[portName]) {
    ports.outports[portName] = {
      label: portName,
      x: option.nodeWidth,
      y: option.nodeHeight / 2,
    };
  }
  const port = ports.outports[portName];
  // Port will have top edge's color
  if (route !== undefined) {
    port.route = route;
  }
  return port;
}
function getNodeInport(graph, nodeName, portName, route, componentName, option) {
  const ports = getPorts(graph, nodeName, componentName);
  if (!ports.inports[portName]) {
    ports.inports[portName] = {
      label: portName,
      x: 0,
      y: option.nodeHeight / 2,
    };
  }
  const port = ports.inports[portName];
  // Port will have top edge's color
  if (route !== undefined) {
    port.route = route;
  }
  return port;
}


function groupRect(group, graph) {
  const limits = geometryutils.findMinMax(graph, group.nodes);
  limits.width = limits.maxX - limits.minX;
  limits.height = limits.maxY - limits.minY;
  console.log('groupRect', limits);

  return limits;
}

function groupRects(graph) {
  const { groups } = graph;
  return groups.map((group) => {
    const limits = groupRect(group, graph);
    limits.width += 80;
    limits.height += 100;
    return { ...group, metadata: { ...group.metadata, limits } };
  });
}

function createEdgePathArray(sourceX, sourceY, c1X, c1Y, c2X, c2Y, targetX, targetY) {
  return [
    'M',
    sourceX, sourceY,
    'C',
    c1X, c1Y,
    c2X, c2Y,
    targetX, targetY,
  ];
}

function findPointOnCubicBezier(p, sx, sy, c1x, c1y, c2x, c2y, ex, ey) {
  // p is percentage from 0 to 1
  const op = 1 - p;
  // 3 green points between 4 points that define curve
  const g1x = sx * p + c1x * op;
  const g1y = sy * p + c1y * op;
  const g2x = c1x * p + c2x * op;
  const g2y = c1y * p + c2y * op;
  const g3x = c2x * p + ex * op;
  const g3y = c2y * p + ey * op;
  // 2 blue points between green points
  const b1x = g1x * p + g2x * op;
  const b1y = g1y * p + g2y * op;
  const b2x = g2x * p + g3x * op;
  const b2y = g2y * p + g3y * op;
  // Point on the curve between blue points
  const x = b1x * p + b2x * op;
  const y = b1y * p + b2y * op;
  return [x, y];
}


function perpendicular(x, y, oldM, l) {
  const m = -1 / oldM;
  const b = y - m * x;
  const point1 = findLinePoint(x, y, m, b, l / 2);
  const point2 = findLinePoint(x, y, m, b, l / -2);
  return [point1, point2];
}

function findLinePoint(x, y, m, b, offset, flip) {
  const x1 = x + offset / Math.sqrt(1 + m * m);
  let y1;
  if (Math.abs(m) === Infinity) {
    y1 = y + (flip || 1) * offset;
  } else {
    y1 = (m * x1) + b;
  }
  return [x1, y1];
}

export default {};

export {
  assambleGraph,
  groupRect,
  groupRects,
  updateNode,
  buildLines,
  buildLine,
};
