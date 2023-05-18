# Random Selection Number Website for Teachers
This project was developed to assist teachers in the random selection of students for short tests using a random number generator. The goal was to streamline and expedite the selection process for teachers who faced challenges in manually selecting students.

## Purpose
The purpose of this project is to provide an easy-to-use website where teachers can generate random numbers for student selection during short tests or classroom activities. By automating the random selection process, this tool eliminates the need for manual selection methods and ensures fairness and impartiality in student selection.

## Features
Random Number Generation: The website utilizes a random number generator to generate random numbers within a specified range.
Customizable Range: Teachers can customize the range of random numbers based on the total number of students or specific requirements.
Exclusion List: The tool allows teachers to exclude certain numbers from the generated random selection to avoid repetition or select from a specific subset of students.
Real-time Generation: Random numbers are generated in real-time, providing instant results for the teacher.
Firebase Integration
This project is integrated with Firebase, a popular development platform that provides a range of tools and services for building web and mobile applications. Firebase offers a real-time database, authentication, hosting, and more. In this project, Firebase is used to store and manage the excluded numbers list, ensuring persistence across different sessions.

To integrate Firebase into your project, follow these steps:

Sign in to the Firebase Console (https://console.firebase.google.com/) or create a new account if you don't have one.
Create a new Firebase project for your random selection number website.
Copy the Firebase configuration object provided for your project.
Create a file named firebaseConfig.js in the /src/config directory.
Paste the Firebase configuration object into the firebaseConfig.js file and save it.
javascript
Copy code
const firebaseConfig = {
  // Paste your Firebase configuration object here
};

export default firebaseConfig;
Your Firebase integration is now complete! The website will connect to the Firebase project using the provided configuration.
Getting Started
To use this tool, follow these steps:

Clone the repository: git clone https://github.com/your-username/random-selection-number-website.git
Navigate to the project directory: cd random-selection-number-website
Install the dependencies: npm install
Start the development server: npm start
Open your browser and access the website at http://localhost:3000


## Contributing
Contributions are welcome! If you have any ideas, suggestions, or improvements for this project, please feel free to submit a pull request. Ensure that you follow the project's code style and provide detailed information about your changes.

## Acknowledgments
I would like to express my gratitude to my teacher for inspiring and motivating me to develop this project. Their struggles in the random selection process encouraged me to create a solution that could benefit not only them but also other teachers facing similar challenges.

## Contact
If you have any questions, suggestions, or feedback, please feel free to reach out to me at kuna.patryk@gmail.com

Thank you for using the Random Selection Number Website for Teachers!
