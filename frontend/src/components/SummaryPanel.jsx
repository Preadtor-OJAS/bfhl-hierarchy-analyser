export default function SummaryPanel({ summary, user_id, email_id, college_roll_number }) {
  const { total_trees, total_cycles, largest_tree_root } = summary;

  return (
    <div className="card">
      <div className="card-title">
        <span className="icon">📊</span>
        Summary
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="sc-icon">🌳</div>
          <div className="sc-value">{total_trees}</div>
          <div className="sc-label">Valid Trees</div>
        </div>
        <div className="summary-card">
          <div className="sc-icon">🔄</div>
          <div className="sc-value">{total_cycles}</div>
          <div className="sc-label">Cycles</div>
        </div>
        <div className="summary-card">
          <div className="sc-icon">🏆</div>
          <div className="sc-value">{largest_tree_root || '—'}</div>
          <div className="sc-label">Deepest Root</div>
        </div>
      </div>

      <div className="section-divider" style={{ marginTop: 24 }}>
        <span>Identity</span>
      </div>

      <div className="identity-rows">
        {[
          { label: 'User ID',     value: user_id },
          { label: 'Email',       value: email_id },
          { label: 'Roll Number', value: college_roll_number },
        ].map(({ label, value }) => (
          <div key={label} className="identity-row">
            <span className="identity-row-label">{label}</span>
            <span className="identity-row-value">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
