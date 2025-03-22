import React, { useState, useEffect } from "react";
import Chatbot from "./chat_bot";
import Chatbot_new from "./chatbot";
import Instructions from "../Instructions/Instructions";
import { useNavigate, useLocation } from "react-router-dom";
import AUT_ from "./AUT_";
import styles from "./organize.module.css"; // Importing the CSS module
import * as XLSX from "xlsx";

function AUT_gpt() {
  const [round, setRound] = useState(1); // Manage round as state
  const [task, setTask] = useState(2);
  const [tempsArray, setTemps_Array] = useState([0.0, 1.0, 2.0]);
  const [temperature, setTemperature] = useState();
  const [resetToggle, setResetToggle] = useState(false);
  const [randomIndex, setRandomIndex] = useState();
  const navigate = useNavigate();

  const location = useLocation();
  const { data } = location.state || [];
  const [objectArray, setObjectArray] = useState(data); // State to store the entire dataset
  const [randomString, setRandomString] = useState("");

  useEffect(() => {
    async function fetchAndParseXLSX() {
      // Save the entire dataset
      // console.log("Object: ", objectArray);
      // console.log("DATA: ", data);
      // Selecting a random string from the first column of a random row
      if (objectArray.length > 0) {
        const randomIndex = Math.floor(Math.random() * objectArray.length);
        setRandomString(objectArray[randomIndex][0]);
        const newArray = [
          ...data.slice(0, randomIndex),
          ...data.slice(randomIndex + 1),
        ];
        // Update local state (optional, if you want to see the array post removal in ComponentA)
        setObjectArray(newArray);
      }
    }

    fetchAndParseXLSX();
  }, [task]);

  const random_temp = () => {
    setRandomIndex(Math.floor(Math.random() * tempsArray.length));
  };

  useEffect(() => {
    const selectedNumber = tempsArray[randomIndex];
    setTemperature(selectedNumber);
  }, [randomIndex]);

  useEffect(() => {
    setTemps_Array((prev) => prev.filter((_, index) => index !== randomIndex));
  }, [temperature]);

  useEffect(() => {
    random_temp(); // Initialize temperature
    // console.log("RANDOMISED TEMPERATURE: ", temperature);
    // console.log("TEMP ARRAY: ", tempsArray);

    if (task === 5) {
      navigate("/PostSurvey");
    }
  }, [task]); // Empty array ensures this only runs once on mount

  useEffect(() => {
    // console.log("TEMP ARRAY: ", tempsArray);
    if (round === 4) {
      console.log(`Task ${task} completed!`);
      setTask((prevTask) => prevTask + 1);
      setRound(1);
      setResetToggle(true);
    }
  }, [round]); // Ensure all dependencies are correctly listed

  return (
    <>
      <div className={styles.main}>
        <Instructions
          className={styles.instructions}
          round={round}
          task={task}
        />
        <div className={styles.bottom_container}>
          <div className={styles.aut_component}>
            <AUT_
              round={round}
              onStateChange={setRound}
              task={task}
              randomString={randomString}
            />
          </div>
          <div className={styles.chat}>
            <Chatbot_new
              resetToggle={resetToggle}
              onReset={() => setResetToggle(false)}
              temperature={temperature}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default AUT_gpt;
