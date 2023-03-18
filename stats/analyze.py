import json
import matplotlib.pyplot as plt
from datetime import datetime

# Load the JSON data
with open("done.json") as f:
    data = json.load(f)

# Create a dictionary to hold the chapter vs time taken data
chapter_time = {}
chapter_time_by_submission_time = {}

# Populate the dictionary with data from the JSON
for chapter, questions in data.items():
    time_list = []
    for question, time in questions.items():
        time_list.append(float(time["timeTaken"]))
        submission_time = int(time.get("submissionTime", 0))
        dt = datetime.fromtimestamp(submission_time/1000)
        submission_time_str = dt.strftime('%Y-%m-%d %H:%M:%S')
        if submission_time_str not in chapter_time_by_submission_time:
            chapter_time_by_submission_time[submission_time_str] = []
        chapter_time_by_submission_time[submission_time_str].append(
            float(time["timeTaken"]))
    chapter_time[chapter] = time_list

# Create a list of the chapter names and a list of the times taken
chapters = list(chapter_time.keys())
times = [sum(chapter_time[chapter])/len(chapter_time[chapter])
         for chapter in chapters]

# Display the bar graph using matplotlib
plt.bar(chapters, times)
plt.xlabel("Chapter")
plt.ylabel("Average Time Taken")
plt.title("Chapter vs Average Time Taken")
plt.xticks(rotation=90)
plt.show()

# Display the line chart using matplotlib
submission_times = list(chapter_time_by_submission_time.keys())
submission_times.sort()
average_times_by_submission_time = []
for submission_time in submission_times:
    time_list = chapter_time_by_submission_time[submission_time]
    average_time = sum(time_list) / len(time_list)
    average_times_by_submission_time.append(average_time)
plt.plot(submission_times, average_times_by_submission_time)
plt.xlabel("Submission Time")
plt.ylabel("Average Time Taken")
plt.title("Average Time Taken vs Submission Time")
plt.xticks(rotation=90)
plt.show()

# Display the average time taken per chapter
for chapter, time in zip(chapters, times):
    print(f"Average time taken for {chapter}: {time}")
