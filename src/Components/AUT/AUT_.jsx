import React, { useState, useEffect } from "react";
import styles from "./AUT_.module.css"; // Importing the CSS module
import { useNavigate, useLocation } from "react-router-dom";
import { useSurvey } from "../../surveyIDContext";

function AUT({ round, onStateChange, task, randomString, temperature }) {
  const [useCases, setUseCases] = useState(() =>
    Array.from({ length: 15 }, () => ({ use: "", explanation: "" }))
  );
  const { surveyId, setSurveyId } = useSurvey();

  const [inputValue, setInputValue] = useState("");
  const initialUseCases = () =>
    Array.from({ length: 15 }, () => ({ use: "", explanation: "" }));

  // const [inputValue, setInputValue] = useState(() =>
  //   Array.from({ length: 15 }, () => ({ use: "", explanation: "" }))
  // );

  //   let round = 1;
  // const [round, setRound] = useState(1); // Manage round as state

  const updateState = () => {
    onStateChange(round + 1); // Increment or modify the state
  };

  const preSurveyId = surveyId;
  //   console.log("preSurveyId", preSurveyId);
  //   const { preSurveyId } = location.state || {}; // Ensure a fallback if state is undefined

  // JSON body data
  const bodyData = {
    useCases: useCases,
    preSurveyId: surveyId,
    round: round, // Include the round in the JSON body
    object: randomString,
    temperature: temperature,
    task: task,
  };

  const handleChange = (index, type, value) => {
    const newUseCases = [...useCases];
    newUseCases[index][type] = value;
    setUseCases(newUseCases);
  };

  const [timeLeft, setTimeLeft] = useState(180); // 180 seconds = 3 minutes

  useEffect(() => {
    // If timeLeft is 0, submit the form/data
    if (timeLeft === 0) {
      console.log("handle submit when timer is 0");
      handleSubmit();
      setTimeLeft(180);
    }

    // Set interval to countdown the timer
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // Clear interval on re-render to prevent memory leaks
    return () => clearInterval(intervalId);

    // Add timeLeft as a dependency to reset interval when timeLeft changes
  }, [timeLeft]);

  // Convert seconds into minutes and seconds for display
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending data:", JSON.stringify({ bodyData }));

    // Simple client-side validation
    // if (useCases.some((uc) => !uc.use.trim() || !uc.explanation.trim())) {
    //   alert("All fields must be filled out.");
    //   return;
    // }

    try {
      console.log("preSurveyId", preSurveyId);
      let NODE_api = import.meta.env.VITE_NODE_API + "/AUT_gpt";
      const response = await fetch(NODE_api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });
      console.log("response from node AUT_gpt: ", response);
      if (response.ok) {
        response.json().then((body) => {
          console.log(body); // Log the body of the response
          // setInputValue(""); // Clear the input field
          console.log("Submitted for Round", round);
          // setUseCases(initialUseCases()); // Reset form to initial state
          setUseCases(() =>
            Array.from({ length: 15 }, () => ({ use: "", explanation: "" }))
          );
          // setRound((currentRound) => currentRound + 1); // Increment round
          updateState();
        });
      } else {
        alert("Failed to submit form");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit form due to an error.");
    }
  };

  return (
    <>
      <div className={styles.container}>
        <h1>Task {task}</h1>
        <p>
          List as many alternative uses as possible for the following objects
          and provide a reasonable explanation for each use:
        </p>
        <br></br>
        <div className={styles.header}>
          {/* <img
            src="../../assets/bicycle-pump.png"
            alt="Bicycle Pump"
            className={styles.image}
          /> */}
          <h2 className={styles.title}>{randomString}</h2>
        </div>
        <p>Form will be submitted automatically in: {formatTime()}</p>
        <form onSubmit={handleSubmit}>
          {useCases.map((item, index) => (
            <div key={index} className={styles.useCaseGroup}>
              <input
                type="text"
                placeholder={`Use Case #${index + 1}`}
                value={item.use}
                onChange={(e) => handleChange(index, "use", e.target.value)}
                className={styles.inputField}
              />
              <input
                type="text"
                placeholder="Explanation"
                value={item.explanation}
                onChange={(e) =>
                  handleChange(index, "explanation", e.target.value)
                }
                className={styles.inputField}
              />
            </div>
          ))}
          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default AUT;
