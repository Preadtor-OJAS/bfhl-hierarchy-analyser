import { useState } from 'react';
import TreeNode from './TreeNode';

export default function HierarchyCard({ hierarchy }) {
  const [open, setOpen] = useState(true);
  const { root, tree, depth, has_cycle } = hierarchy;
  const isCycle = Boolean(has_cycle);

  return (
    <div className={`hierarchy-card ${isCycle ? 'is-cycle' : 'is-tree'}`}>
      <div className="hierarchy-header" onClick={() => setOpen(o => !o)}>
        <div className="root-badge">{root}</div>
        <div className="hierarchy-meta">
          <div className="hm-root">Root: {root}</div>
          <div className="hm-tags">
            {isCycle ? (
              <span className="tag tag-cycle">⚠ Cycle</span>
            ) : (
              <span className="tag tag-tree">✓ Tree</span>
            )}
            {depth !== undefined && (
              <span className="tag tag-depth">Depth: {depth}</span>
            )}
          </div>
        </div>
        <span className={`chevron${open ? ' open' : ''}`}>⌄</span>
      </div>

      {open && (
        <div className="hierarchy-body">
          {isCycle ? (
            <div className="cycle-placeholder">
              ↺ &nbsp;Cycle detected — no tree structure available
            </div>
          ) : (
            <div className="tree-view">
              <TreeNode node={root} data={tree[root]} isRoot />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
