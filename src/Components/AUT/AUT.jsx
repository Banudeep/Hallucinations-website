import React, { useState, useEffect, useRef } from "react";
import styles from "./AUT.module.css"; // Importing the CSS module
import { useNavigate, useLocation } from "react-router-dom";
import Instructions from "../Instructions/Instructions";
import { useSurvey } from "../../surveyIDContext";
import { useData } from "../../dataContext";

function AUT() {
  const [useCases, setUseCases] = useState(() =>
    Array.from({ length: 15 }, () => ({ use: "", explanation: "" }))
  );
  const { surveyId, setSurveyId } = useSurvey();

  const navigate = useNavigate();
  // const location = useLocation();
  // const { preSurveyId } = location.state || {}; // Ensure a fallback if state is undefined

  const preSurveyId = surveyId;
  // console.log("preSurveyId", preSurveyId);

  const { data, setData } = useData();
  // const [data, setData] = useState([]); // State to store the entire dataset
  const [randomString, setRandomString] = useState("");

  // useEffect(() => {
  //   async function findData() {
  //     // Selecting a random string from the first column of a random row
  //     console.log("Outside IF");
  //     if (data.length > 0) {
  //       console.log("DATA inside IF: ", data);
  //       const randomIndex = Math.floor(Math.random() * data.length);
  //       setRandomString(data[randomIndex]);
  //       const data = [
  //         ...data.slice(0, randomIndex),
  //         ...data.slice(randomIndex + 1),
  //       ];
  //       // Update local state (optional, if you want to see the array post removal in ComponentA)
  //       // setData(newArray);
  //     }
  //   }

  //   findData();
  // }, []);

  const hasRunOnce = useRef(false);

  useEffect(() => {
    if (data.length > 0 && !hasRunOnce.current) {
      console.log("DATA inside IF: ", data);
      const randomIndex = Math.floor(Math.random() * data.length);
      setRandomString(data[randomIndex]);

      const newData = [
        ...data.slice(0, randomIndex),
        ...data.slice(randomIndex + 1),
      ];

      setData(newData);
      hasRunOnce.current = true; // Mark as run once
    }
  }, [data]);

  const handleChange = (index, type, value) => {
    const newUseCases = [...useCases];
    newUseCases[index][type] = value;
    setUseCases(newUseCases);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(
      "Sending data:",
      JSON.stringify({ useCases, preSurveyId: preSurveyId })
    );

    // Simple client-side validation
    // if (useCases.some((uc) => !uc.use.trim() || !uc.explanation.trim())) {
    //   alert("All fields must be filled out.");
    //   return;
    // }

    try {
      // console.log("PreSurveyId", preSurveyId);
      let NODE_api = import.meta.env.VITE_NODE_API + "/AUT";
      const response = await fetch(NODE_api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          useCases,
          preSurveyId: preSurveyId,
          object: randomString,
        }),
      });
      if (response.ok) {
        navigate("/Task2Page", { state: { data: data } });
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
      <Instructions />
      <div className={styles.container}>
        <h1>TASK 1</h1>
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
