import React, { useState, useEffect } from 'react';

// Define the tasks based on your routine.
const tasks = [
  "Wake up before Fajr",
  "Fajr Prayer",
  "Quran Recitation",
  "Short Nap (Qailulah)",
  "Exercise (Health/Fitness)",
  "Web Development Learning & Practice",
  "Dhuha Prayer",
  "Dhuhr Prayer",
  "Job Search & Remote Job Applications",
  "Asr Prayer",
  "Learning or Project Work",
  "Miswak",
  "Maghrib Prayer",
  "Family Time or Relaxation",
  "Review & Reflect on Progress",
  "Isha Prayer",
  "Sunnah Before Sleep",
  "Sleep",
];

const RoutineTracker = () => {
  const [dailyProgress, setDailyProgress] = useState({});
  const [month, setMonth] = useState(getCurrentMonth());
  const [editingCell, setEditingCell] = useState(null);  // Track which cell is being edited
  const [newValue, setNewValue] = useState("");  // Store new value entered by user
  const daysInMonth = new Date(2024, month, 0).getDate(); // Get days in current month

  // Load the data from localStorage or initialize it
  useEffect(() => {
    const savedData = localStorage.getItem(`routineProgress_${month}`);
    if (savedData) {
      setDailyProgress(JSON.parse(savedData));
    }
  }, [month]);

  // Save progress to localStorage when it changes
  useEffect(() => {
    if (Object.keys(dailyProgress).length > 0) {
      localStorage.setItem(`routineProgress_${month}`, JSON.stringify(dailyProgress));
    }
  }, [dailyProgress, month]);

  // Handle the task status or custom value update
  const handleCellClick = (day, task) => {
    // Set the current value in the input box if there's any existing value
    const currentStatus = dailyProgress[day]?.[task] || '';
    setNewValue(currentStatus);
    setEditingCell({ day, task });
  };

  const handleValueChange = (e) => {
    setNewValue(e.target.value);
  };

  const handleBlur = () => {
    if (editingCell) {
      const { day, task } = editingCell;
      updateProgress(day, task, newValue);
      setEditingCell(null);  // Reset editing mode
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  // Update progress with custom value or status
  const updateProgress = (day, task, value) => {
    setDailyProgress((prevState) => {
      const updatedProgress = { ...prevState };
      if (!updatedProgress[day]) {
        updatedProgress[day] = {};
      }
      updatedProgress[day][task] = value;
      return updatedProgress;
    });
  };

  return (
    <div className="container">
      <h1>Monthly Routine Tracker</h1>

      <div className="month-selector">
        <label>Select Month: </label>
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
          {Array.from({ length: 12 }).map((_, index) => (
            <option key={index} value={index + 1}>
              {new Date(2024, index).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>

      <table className="routine-table">
        <thead>
          <tr>
            <th>Task</th>
            {Array.from({ length: daysInMonth }).map((_, dayIndex) => (
              <th key={dayIndex}>Day {dayIndex + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index}>
              <td>{task}</td>
              {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                const day = dayIndex + 1;
                const currentValue = dailyProgress[day]?.[task] || '';
                return (
                  <td
                    key={day}
                    onClick={() => handleCellClick(day, task)}
                    className="status-cell"
                  >
                    {editingCell?.day === day && editingCell?.task === task ? (
                      <input
                        type="text"
                        value={newValue}
                        onChange={handleValueChange}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        autoFocus
                      />
                    ) : (
                      <span>{currentValue || ''}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Utility function to get the current month
function getCurrentMonth() {
  return new Date().getMonth() + 1; // Get current month (1-indexed)
}

export default RoutineTracker;
