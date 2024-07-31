import React, { useState } from 'react';
import axios from 'axios';
import PredictionResult from './response';
import Resize from './resize';
import "./style.css";

function Form( {width} ) {
    console.log('Rendering Form component'); // Debugging statement

    const [formData, setFormData] = useState({
        new_habit_name: '',
        old_habit_name: '',
        date: '',
        time: ''
    });

    const [prediction, setPrediction] = useState(null); // Ensure this is correctly defined

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        
        console.log('Form submitted'); // Debugging statement
        console.log('Form data:', formData); // Debugging statement
        try {
            const response = await axios.post('http://localhost:3001/submit', formData);
            console.log("API response:", response.data); // Debugging statement
            setPrediction(response.data);
        } catch (error) {
            console.error('There was an error!', error);
        }

        setFormData ({
            new_habit_name: '',
            old_habit_name: '',
            date: '',
            time: ''
        });
    };

    return (
        <div className="formContainer">
            {console.log('Rendering form container')} {/* Debugging statement */}
            <form className = "form" onSubmit={handleSubmit}>
                {console.log('Form onSubmit attached')} {/* Debugging statement */}
                <label htmlFor="new_habit_name"></label>
                <input
                    type="text"
                    id="new_habit_name"
                    name="new_habit_name"
                    placeholder="What habit do you want to integrate into your routine?"
                    value={formData.new_habit_name}
                    onChange={handleChange}
                />
                <label htmlFor="old_habit_name"></label>
                <input
                    type="text"
                    id="old_habit_name"
                    name="old_habit_name"
                    placeholder="What are some existing habits you've developed?"
                    value={formData.old_habit_name}
                    onChange={handleChange}
                />
                <label htmlFor="time"></label>
                <input
                    type="text"
                    id="time"
                    name="time"
                    placeholder="What time of day did you complete this habit?"
                    value={formData.time}
                    onChange={handleChange}
                />
                <label htmlFor="date"></label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                />
                <br />
                <button type="submit" id="button">Submit</button>
            </form>
            {prediction && <PredictionResult prediction={prediction} />}
        </div>
    );
}

export default Form;
