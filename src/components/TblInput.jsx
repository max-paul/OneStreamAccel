export default function TblInput({ cols, rows, onChange, addLabel }) {
  const addRow = () => {
    const empty = {};
    cols.forEach((c) => (empty[c.key] = c.default || ''));
    onChange([...rows, empty]);
  };

  const updateRow = (i, key, val) =>
    onChange(rows.map((row, idx) => (idx === i ? { ...row, [key]: val } : row)));

  const delRow = (i) => onChange(rows.filter((_, idx) => idx !== i));

  return (
    <div>
      <table className="table-input" style={{ width: '100%' }}>
        <thead>
          <tr>
            {cols.map((c) => <th key={c.key}>{c.label}</th>)}
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {cols.map((c) => (
                <td key={c.key}>
                  {c.type === 'select' ? (
                    <select value={row[c.key] || ''} onChange={(e) => updateRow(i, c.key, e.target.value)}>
                      {(c.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={row[c.key] || ''}
                      placeholder={c.ph || ''}
                      onChange={(e) => updateRow(i, c.key, e.target.value)}
                    />
                  )}
                </td>
              ))}
              <td>
                <button className="del-btn" type="button" onClick={() => delRow(i)}>
                  <i className="ti ti-trash" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-row-btn" type="button" onClick={addRow}>
        <i className="ti ti-plus" />
        {addLabel || 'Add row'}
      </button>
    </div>
  );
}
