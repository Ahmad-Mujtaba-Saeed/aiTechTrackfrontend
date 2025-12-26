import React from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const BulletPointsEditor = ({ bulletPoints = [], onChange }) => {
  const handleAddBullet = () => {
    onChange([...bulletPoints, { id: Date.now(), bullet: '' }]);
  };

  const handleUpdateBullet = (index, value) => {
    const updated = [...bulletPoints];
    updated[index].bullet = value;
    onChange(updated);
  };

  const handleRemoveBullet = (index) => {
    const updated = bulletPoints.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="form-label">Key Achievements</label>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={handleAddBullet}
        >
          <FiPlus size={14} className="me-1" /> Add Bullet Point
        </button>
      </div>

      {bulletPoints.map((bullet, index) => (
        <div key={bullet.id || index} className="d-flex align-items-start mb-2">
          <span className="me-2 mt-2">•</span>
          <div className="flex-grow-1">
            <input
              type="text"
              className="form-control form-control-sm"
              value={bullet.bullet}
              onChange={(e) => handleUpdateBullet(index, e.target.value)}
              placeholder="Enter achievement or responsibility"
            />
          </div>
          <button
            type="button"
            className="btn btn-sm btn-link text-danger ms-2"
            onClick={() => handleRemoveBullet(index)}
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default BulletPointsEditor;
