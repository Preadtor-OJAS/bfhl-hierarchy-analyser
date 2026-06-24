export default function TreeNode({ node, data, isRoot = false }) {
  const children = Object.entries(data || {});

  return (
    <div className="tree-node">
      <div className="tree-node-row">
        <span className={`node-label${isRoot ? ' is-root' : ''}`}>{node}</span>
        {children.length === 0 && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>leaf</span>
        )}
      </div>
      {children.length > 0 && (
        <div className="tree-children">
          {children.map(([childKey, childData]) => (
            <TreeNode key={childKey} node={childKey} data={childData} />
          ))}
        </div>
      )}
    </div>
  );
}
