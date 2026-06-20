import React from 'react';
import { FaTasks, FaClock, FaSpinner, FaCheckCircle } from 'react-icons/fa';

const StatsCards = ({ stats = { total: 0, pending: 0, inProgress: 0, completed: 0 } }) => {
  const cards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: <FaTasks />,
      color: 'primary',
      bgLight: 'rgba(37, 99, 211, 0.08)',
    },
    {
      title: 'Pending Tasks',
      value: stats.pending,
      icon: <FaClock />,
      color: 'warning',
      bgLight: 'rgba(245, 158, 11, 0.08)',
    },
    {
      title: 'In Progress Tasks',
      value: stats.inProgress,
      icon: <FaSpinner className="spin-slow" />,
      color: 'info',
      bgLight: 'rgba(56, 189, 248, 0.08)',
    },
    {
      title: 'Completed Tasks',
      value: stats.completed,
      icon: <FaCheckCircle />,
      color: 'success',
      bgLight: 'rgba(16, 185, 129, 0.08)',
    },
  ];

  return (
    <div className="row g-3 mb-4">
      {cards.map((card, index) => (
        <div key={index} className="col-12 col-sm-6 col-xl-3">
          <div className="custom-card p-3 h-100 d-flex align-items-center">
            <div className="d-flex align-items-center justify-content-between w-100">
              <div>
                <span className="text-secondary small fw-medium text-uppercase tracking-wider">
                  {card.title}
                </span>
                <h3 className="fw-bold mb-0 mt-1">{card.value}</h3>
              </div>
              <div 
                className={`rounded-circle d-flex align-items-center justify-content-center text-${card.color}`}
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  backgroundColor: card.bgLight,
                  fontSize: '1.5rem',
                }}
              >
                {card.icon}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
