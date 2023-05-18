import React, { useState, useEffect, useRef } from "react";
import $ from 'jquery';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, onSnapshot, runTransaction, orderBy, query, where, Timestamp, setDoc, limit } from 'firebase/firestore';

import student from './studentslist.js';

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const RandomNumberGenerator = (props) => {
    const [excludedNumbers, setExcludedNumbers] = useState([]);
    const [generatedNumbers, setGeneratedNumbers] = useState([]);
    const [rangeValue, setRangeValue] = useState(33);
    const klasa = props.klasa;

    const [index, setIndex] = useState(5);


    const handleGenerateNumbers = async () => {
        setGeneratedNumbers([]);
        const numbers = [];
        let i = 0;

        console.log('Wylosowane liczby to');
        while (numbers.length < [index + 1]) {
            const random = Math.floor(Math.random() * (rangeValue)) + 1;
            console.log(random);

            if (!excludedNumbers.includes(random) && !numbers.includes(random)) {
                numbers.push(random);
            }

            if (i++ > 1000) {
                console.warn("Too many iterations!");
                break;
            }
        }

        for (let i = 0; i < numbers.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setGeneratedNumbers((prevNumbers) => [...prevNumbers, numbers[i]]);
        }


        // await new Promise(resolve => setTimeout(resolve, 3000));


        // Create a new Firestore document with a unique ID

    };

    const handleExcludedNumbersToggle = (number) => {
        if (excludedNumbers.includes(number)) {
            setExcludedNumbers(excludedNumbers.filter((excludedNumber) => excludedNumber !== number));
        } else {
            if (generatedNumbers.includes(number)) {
                setGeneratedNumbers(generatedNumbers.filter((generatedNumbers) => generatedNumbers !== number));
                const numbers = [];
                let i = 0;

                console.log('Dolosowana liczba to');
                while (numbers.length < 1) {
                    const random = Math.floor(Math.random() * (rangeValue)) + 1;
                    console.log(random);

                    if (!excludedNumbers.includes(random) && !numbers.includes(random) && !generatedNumbers.includes(random)) {
                        numbers.push(random);
                    }

                    if (i++ > 1000) {
                        console.warn("Too many iterations!");
                        break;
                    }
                }

                for (let i = 0; i < numbers.length; i++) {
                    setGeneratedNumbers((prevNumbers) => [...prevNumbers, numbers[i]]);
                }
            }
            else {
                setExcludedNumbers([...excludedNumbers, number]);
            }
        }
    };

    useEffect(() => {
        setGeneratedNumbers([]);
    }, [rangeValue]);

    let percentageChance;
    const totalBalls = rangeValue - excludedNumbers.filter(excluded => excluded <= rangeValue).length;
    for (let i = 1; i <= rangeValue; i++) {
        const isExcluded = excludedNumbers.includes(i);
        const isGenerated = generatedNumbers.includes(i);
        const isDraftable = !isExcluded && !isGenerated;
        percentageChance = `${(((index + 1) / totalBalls) * 100).toFixed(1)}`;
    }

    if (percentageChance > 100) {
        percentageChance = (100).toFixed(1);
    }



    const generateBalls = () => {
        const balls = [];

        for (let i = 1; i <= rangeValue; i++) {
            const isExcluded = excludedNumbers.includes(i);
            const isGenerated = generatedNumbers.includes(i);
            let studentName = null;


            if (klasa === '3a') {
                const matchingStudent = student.find(s => s.number === i);
                if (matchingStudent) {
                    studentName = matchingStudent.name;
                }
            }

            balls.push(
                <div
                    key={i}
                    className={`ball ${isExcluded ? 'excluded' : ''} ${isGenerated ? 'generated' : ''}`}
                    onClick={() => handleExcludedNumbersToggle(i)}
                >
                    <div className="ball-number">{i}</div>
                    {studentName && <div className="student-name">{studentName}</div>}
                </div>
            );

            /*
            if (percentageChance) {
                balls.push(
                    <div className="ball-chance">{percentageChance}</div>
                );

                {klasa === '3a' ? (
                        student.filter((s) => s.number === i).map((s) => (
                            <div key={s.number} className="student-name">
                                <span>{s.name}</span>
                            </div>
                        ))
                    ) : null}
            }*/
        }

        return balls;
    };


    const slideValueRef = useRef(null);
    const inputSliderRef = useRef(null);

    const handleSlideValue = () => {
        const value = inputSliderRef.current.value;
        slideValueRef.current.textContent = value;
    };

    const balls = generateBalls();


    for (var i = 1; i <= 10; i++) {
        var span = $("<span>").text(i);
        $("#box").append(span);
    }

    const nums = Array.from({ length: 10 }, (_, i) => i + 1);

    const nextNum = () => {
        setIndex((index + 1) % nums.length);
    };

    const prevNum = () => {
        setIndex((index - 1 + nums.length) % nums.length);
    };




    const [latestDocument, setLatestDocument] = useState(null);
    const [prevDraws, setPrevDraws] = useState(null);
    const [latestBalls, setLatestBalls] = useState(null);

    useEffect(() => {
        const losowaniadb = `losowania-${props.klasa}`;
        const unsubscribe = onSnapshot(
            query(
                collection(db, losowaniadb),
                orderBy('timestamp', 'desc'),
                limit(1)
            ),
            (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setLatestDocument(doc.data());
                });
            }
        );

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (latestDocument) {
            if (klasa === "3a") {
                setExcludedNumbers([...latestDocument.liczby, 31]);
            } else {
                setExcludedNumbers(latestDocument.liczby);
            }
        }
    }, [latestDocument]);


    function refreshPage() {
        window.location.reload();
    }

    // Add a new state variable to store the previous draws
    const [previousDraws, setPreviousDraws] = useState([]);

    // Retrieve the previous 10 draws from the database when the component mounts
    useEffect(() => {
        const losowaniadb = `losowania-${props.klasa}`;
        const unsubscribe = onSnapshot(
            query(
                collection(db, losowaniadb),
                orderBy('timestamp', 'desc'),
                limit(10)
            ),
            (querySnapshot) => {
                const previousDraws = [];
                querySnapshot.forEach((doc) => {
                    previousDraws.push(doc.data());
                });
                setPreviousDraws(previousDraws);
            }
        );

        return () => unsubscribe();
    }, []);

    // Render the previous draws
    const renderPreviousDraws = () => {
        // Initialize an empty object to keep track of the number of times each number is drawn
        const numberCount = {};

        // Loop through the previous draws and update the numberCount object
        previousDraws.forEach((draw) => {
            draw.liczby.forEach((number) => {
                numberCount[number] = (numberCount[number] || { count: 0, percentage: 0 });
                numberCount[number].count++;
                numberCount[number].percentage = (numberCount[number].count / previousDraws.length) * 100;
            });
        });

        // Calculate the total number of draws
        const totalDraws = previousDraws.length;


        // Sort the numberCount object by count
        const sortedNumbers = Object.keys(numberCount).sort((a, b) => numberCount[b].count - numberCount[a].count);

        // Render the previous draws and statistics
        return (
            <div className="archsection">
                {previousDraws.map((draw, index) => {
                    const options = {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                    };
                    return (
                        <div key={index} className="archiwalne">
                            <p>{draw.timestamp.toDate().toLocaleDateString('pl-PL', options)}</p>
                            <div className="generated-numbers-container archive">
                                {draw.liczby.map((number) => (
                                    <div key={number} className="ball arch">{number}</div>
                                ))}
                            </div>
                        </div>
                    );
                })}
                <div className="archiwalne stats">
                    {sortedNumbers.length > 0 && <p className="title">Najczęściej losowane</p>}
                    <div className="generated-numbers-container archive">
                        {sortedNumbers.slice(0, 3).map((number) => (
                            <div>
                                <p key={number} class="ball"><span className="cyfra">{number}</span><span class="percentage">{numberCount[number].percentage.toFixed(0)}%</span></p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const ballsprev = renderPreviousDraws();



    return (
        <div className="random-number-generator-container">
            <div className="upper-line">
                <div className="container-button">
                    <span className="next" onClick={nextNum}><i className="fa-solid fa-plus"></i></span>
                    <span className="prev" onClick={prevNum}><i class="fa-solid fa-minus"></i></span>
                    <div id="box">
                        {nums.map((num, i) => (
                            <span key={i} style={{ display: i === index ? 'initial' : 'none' }}>
                                {num}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="form-container">
                    <div className="input-label">
                        <input
                            type="range"
                            id="range-value-input"
                            ref={inputSliderRef}
                            min={1}
                            max={36}
                            value={rangeValue}
                            onChange={(e) => {
                                setRangeValue(parseInt(e.target.value));
                            }}
                            onInput={handleSlideValue}

                        />
                        <div class="value right" ref={slideValueRef}>33</div>
                    </div>
                </div>
                <div className="userPanel">{klasa}<span onClick={refreshPage}>Wyloguj</span></div>
            </div>
            <div className="generated-numbers-container">
                <div className="ball-container">{balls}</div>
            </div>
            <div className="buttons">
                <button className="generate-button add" onClick={() => {
                    if (generatedNumbers.length > 0) {
                        const losowaniadb = `losowania-${props.klasa}`;

                        // Check if all the generated numbers match a previous draw
                        const isDuplicate = previousDraws.some((draw) => {
                            return generatedNumbers.length === draw.liczby.length && generatedNumbers.every((number, index) => {
                                return number === draw.liczby[index];
                            });
                        });

                        if (!isDuplicate) {
                            addDoc(collection(db, losowaniadb), {
                                timestamp: Timestamp.now(),
                                liczby: generatedNumbers,
                            });
                            generatedNumbers = [];
                        }
                    }
                }}>Zapisz</button>
                <button className="generate-button put" onClick={handleGenerateNumbers}>
                    Losowanie
                    <div className="procent">{percentageChance}%</div>
                </button>
                <button className="generate-button remove" onClick={() => {
                    setGeneratedNumbers([]);
                }}>Skasuj
                </button>
            </div>
            <div className="archbig">{ballsprev}</div>
        </div>
    );
};

export default RandomNumberGenerator;