const USER_ID = 'OjasSharma_27082005';
const EMAIL_ID = 'ojas1400.be23@chitkara.edu.in';
const COLLEGE_ROLL_NUMBER = '2310991400';

const express = require('express');
const router = express.Router();

const VALID_EDGE_RE = /^([A-Z])->([A-Z])$/;

function isValidEdge(entry) {
  const m = entry.match(VALID_EDGE_RE);
  if (!m) return false;
  if (m[1] === m[2]) return false;
  return true;
}

function buildGraph(edges) {
  const children = {};
  const parentOf = {};
  const allNodes = new Set();

  for (const edge of edges) {
    const [, p, c] = edge.match(VALID_EDGE_RE);
    allNodes.add(p);
    allNodes.add(c);
    if (!children[p]) children[p] = [];
    if (!children[c]) children[c] = [];

    if (parentOf[c] !== undefined) continue;

    children[p].push(c);
    parentOf[c] = p;
  }

  return { children, parentOf, allNodes };
}

function findComponents(allNodes, children) {
  const adj = {};
  for (const n of allNodes) adj[n] = new Set();
  for (const [p, cs] of Object.entries(children)) {
    for (const c of cs) {
      adj[p].add(c);
      adj[c].add(p);
    }
  }

  const visited = new Set();
  const components = [];

  for (const start of allNodes) {
    if (visited.has(start)) continue;
    const component = new Set();
    const queue = [start];
    while (queue.length) {
      const n = queue.shift();
      if (visited.has(n)) continue;
      visited.add(n);
      component.add(n);
      for (const nb of adj[n]) {
        if (!visited.has(nb)) queue.push(nb);
      }
    }
    components.push(component);
  }

  return components;
}

function hasCycle(nodes, children) {
  const color = {};
  for (const n of nodes) color[n] = 0;

  function dfs(u) {
    color[u] = 1;
    for (const v of (children[u] || [])) {
      if (color[v] === 1) return true;
      if (color[v] === 0 && dfs(v)) return true;
    }
    color[u] = 2;
    return false;
  }

  for (const n of nodes) {
    if (color[n] === 0 && dfs(n)) return true;
  }
  return false;
}

function buildTree(node, children, visited = new Set()) {
  if (visited.has(node)) return {};
  visited.add(node);
  const obj = {};
  for (const child of (children[node] || [])) {
    obj[child] = buildTree(child, children, new Set(visited));
  }
  return obj;
}

function calcDepth(node, children) {
  const kids = children[node] || [];
  if (kids.length === 0) return 1;
  return 1 + Math.max(...kids.map(k => calcDepth(k, children)));
}

function processData(data) {
  const invalidEntries = [];
  const validRaw = [];

  for (const raw of data) {
    const trimmed = String(raw).trim();
    if (isValidEdge(trimmed)) {
      validRaw.push(trimmed);
    } else {
      invalidEntries.push(raw);
    }
  }

  const seen = new Set();
  const duplicateEdges = [];
  const uniqueEdges = [];

  for (const edge of validRaw) {
    if (seen.has(edge)) {
      if (!duplicateEdges.includes(edge)) duplicateEdges.push(edge);
    } else {
      seen.add(edge);
      uniqueEdges.push(edge);
    }
  }

  const { children, parentOf, allNodes } = buildGraph(uniqueEdges);
  const components = findComponents(allNodes, children, parentOf);

  const hierarchies = [];
  let totalTrees = 0;
  let totalCycles = 0;
  let largestRoot = null;
  let largestDepth = -1;

  for (const component of components) {
    const roots = [...component].filter(n => parentOf[n] === undefined);
    const root = roots.length > 0 ? roots.sort()[0] : [...component].sort()[0];

    if (hasCycle(component, children)) {
      totalCycles++;
      hierarchies.push({ root, tree: {}, has_cycle: true });
    } else {
      const tree = { [root]: buildTree(root, children) };
      const depth = calcDepth(root, children);
      totalTrees++;
      hierarchies.push({ root, tree, depth });

      if (depth > largestDepth || (depth === largestDepth && root < largestRoot)) {
        largestDepth = depth;
        largestRoot = root;
      }
    }
  }

  const summary = {
    total_trees: totalTrees,
    total_cycles: totalCycles,
    largest_tree_root: largestRoot || '',
  };

  return { hierarchies, invalid_entries: invalidEntries, duplicate_edges: duplicateEdges, summary };
}

router.post('/', (req, res) => {
  try {
    const { data } = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ error: '"data" must be an array of strings.' });
    }

    const result = processData(data);

    return res.status(200).json({
      user_id: USER_ID,
      email_id: EMAIL_ID,
      college_roll_number: COLLEGE_ROLL_NUMBER,
      ...result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
