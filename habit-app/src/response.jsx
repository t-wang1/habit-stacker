import React from 'react';

function PredictionResult({ prediction }) {
    console.log("PredictionResult received prediction:", prediction); // Debugging statement

    if (!prediction) {
        return <div></div>;
    }

    return (
        <div>
            <p>If you want to add {prediction.new_habit} into your routine, you should do the following habit in the {prediction.predicted_time_of_day} before it: {prediction.predicted_old_habit} </p>
        </div>
    );
}

export default PredictionResult;
