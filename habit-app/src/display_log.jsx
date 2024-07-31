import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './HabitsList.css'; // Optional: for styling

function HabitsList() {
    const [habits, setHabits] = useState([]);

    useEffect(() => {
        // Fetch data from backend
        axios.get('http://localhost:3001/habits')
            .then(response => {
                setHabits(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div className="habits-list">
            {/* <h1>Habits</h1> */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>New Habit Name</th>
                        <th>Old Habit Name</th>
                        <th>Date</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {habits.map(habit => (
                        <tr key={habit.id}>
                            <td>{habit.id}</td>
                            <td>{habit.new_habit_name}</td>
                            <td>{habit.old_habit_name}</td>
                            <td>{habit.date}</td>
                            <td>{habit.time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default HabitsList;
