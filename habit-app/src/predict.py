import mysql.connector
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
# from sklearn.metrics import accuracy_score

import json
import warnings
warnings.filterwarnings('ignore')

# connect to sql database
connection = mysql.connector.connect(
    host = "localhost",
    user = "root",
    password = "newpassword",
    database = "db"
)

# extrapolate data into data frame
query = "SELECT * FROM habits"
data_frame = pd.read_sql(query, connection)

# get the new habit you're predicting for
query_new_habit = "SELECT new_habit_name FROM habits ORDER BY id DESC LIMIT 1"
new_habit_df = pd.read_sql(query_new_habit, connection)
new_habit = new_habit_df['new_habit_name'].iloc[0]

connection.close()
# print(data_frame)

new_habit_encoder = LabelEncoder()
old_habit_encoder = LabelEncoder()
time_encoder = LabelEncoder()

# Fit the encoders on the entire dataset
new_habit_encoder.fit(data_frame['new_habit_name'])
old_habit_encoder.fit(data_frame['old_habit_name'])
time_encoder.fit(data_frame['time'])

data_frame['new_habit_name'] = new_habit_encoder.fit_transform(data_frame['new_habit_name'])
data_frame['old_habit_name'] = old_habit_encoder.fit_transform(data_frame['old_habit_name'])
data_frame['time'] = time_encoder.fit_transform(data_frame['time'])

# features
X = data_frame[['new_habit_name']] # features

#target
y = data_frame[['old_habit_name', 'time']]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

# Encode the new habit to predict
new_habit_encoded = new_habit_encoder.transform([new_habit])[0]

# Predict the old habit and time for the new habit
prediction = clf.predict([[new_habit_encoded]])
predicted_old_habit = old_habit_encoder.inverse_transform([prediction[0][0]])
predicted_time_of_day = time_encoder.inverse_transform([prediction[0][1]])

output = {
    "new_habit": new_habit,
    "predicted_old_habit": predicted_old_habit[0],
    "predicted_time_of_day": predicted_time_of_day[0]
}

print(json.dumps(output))