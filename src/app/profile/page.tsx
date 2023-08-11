"use client";
import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Spinner,
  Container,
  DropdownButton,
  Dropdown,
  Alert,
  Accordion,
} from "react-bootstrap";
import SaveIcon from "@mui/icons-material/Save";
import Fab from "@mui/material/Fab";
import { useCookies } from "react-cookie";
import { toast } from "react-hot-toast";
import data from "./data.json";

import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "next/navigation";
import { ElevatorSharp } from "@mui/icons-material";
import { fetchQuestionData } from "@/api/fetchQuestionData";
import { createQuestions } from "@/utilities/createQuestionObject";
import axios from "axios";
import { fetchProfileData } from "@/api/fetchProfileData";

interface UserData {
  username: string;
  email: string;
  fname: string;
  lname: string;
  links: string;
}

interface UrlData {
  topic: string;
  link: string;
  status: string;
}

interface StepData {
  urls: any;
  heading: string;
  subheadings: SubHeadings;
  links: any;
}

interface SubHeadings {
  map(
    arg0: (
      subheading: SubHeadings,
      subIndex: number
    ) => import("react").JSX.Element
  ): import("react").ReactNode;
  length: number;
  sub_heading: string;
  sub_heading_id: number;
  questions: Questions;
}

interface Questions {
  topic: string;
  length: number;
  map(
    arg0: (urlObj: any, innerIndex: number) => import("react").JSX.Element
  ): import("react").ReactNode;
  topic_id: number;
  link: string;
}

const styles = {
  container: {
    background: "#1a1a1a",
    color: "#fff",
    padding: "20px",
  },
  card: {
    background: "#262626",
    border: "1px solid #333",
    marginBottom: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  button: {
    background: "#007bff",
    border: "none",
    color: "#fff",
    padding: "10px 15px",
    cursor: "pointer",
    fontSize: "16px",
    borderRadius: "5px",
    transition: "background 0.3s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  link: {
    color: "#61dafb",
    textDecoration: "none",
  },
};

export default function ProfilePage() {
  const [cookies] = useCookies(["token"]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [outerOpen, setOuterOpen] = useState<boolean>(false);
  const [innerOpen, setInnerOpen] = useState<boolean>(false);
  const [stepData, setStepData] = useState<StepData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState(Array(3).fill("unvisited"));
  const [check, setCheck] = useState(true);
  const [parsed, setParsed] = useState<any | null>(null);

  const toggleOuterCollapse = () => {
    setOuterOpen(!outerOpen);
  };

  const toggleInnerCollapse = () => {
    setInnerOpen(!innerOpen);
  };
  const fabStyle = {
    position: "fixed",
    bottom: 16,
    right: 16,
  };
  const fab = {
    color: "primary" as "primary",
    sx: fabStyle,
    icon: <SaveIcon />,
    label: "Add",
  };
  const router = useRouter();

  useEffect(() => {
    const setProfileData = async () => {  
      try {
        const response = await fetchProfileData(cookies["token"])
        const data = JSON.parse(response.data);
        let obj: UserData = data;
        if (response.status === 200) {
          setUserData(obj);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Error fetching profile data");
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    setProfileData();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      const questions = await createQuestions();
      setStepData(questions);
    };
    fetchQuestions();
    setLoading(false);
  }, []);

  const SaveClick = async () => {
    const axios = require("axios");
    let data = JSON.stringify({
      topic_id: "3",    // change this later 
      user: userData?.username,
    });

    let config = {
      method: "POST",
      maxBodyLength: Infinity,
      url: "http://localhost:8000/db/saveUserVisit",
      headers: {
        "Content-Type": "application/json",
        Authorization:
        "Bearer " + cookies["token"],
      },
      data: data,
    };

    axios
      .request(config)
      .then((response: { data: any; }) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error: any) => {
        console.log(error);
      });

    // const endpoint = "http://localhost:8000/api/auth/profile";
    // const options = {
    //   method: "POST",
    //   headers: {
    //     Authorization: "Bearer " + cookies["token"],
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ topic_id: "11B" }), //this needs to be modified later
    // };
    // const response = await fetch(endpoint, options);
    // if (response.ok) {
    //   toast("Your progress has been saved");
    //   router.push("/profile");
    // }
  };

  const status_click = (
    token: string,
    index: number,
    subIndex: number,
    // innerIndex: number,
    // innerKey: string,
    topic_id: number
  ) => {
    const copyData = [...stepData];
    // console.log('stepData:',copyData[0].subheadings[subIndex].questions[0]);

    const userDataCopy = userData ?? {
      username: "",
      email: "",
      fname: "",
      lname: "",
      links: "",
    };
    const copyStatus = status;
    copyStatus[topic_id - 1] = token;
    setStatus(copyStatus);
    setStepData(copyData);
    // if (token === "visited") {
    //   copyData[index].subheadings[subIndex] = token;

    //   const copyParse = parsed;

    //   copyParse[topic] = token;

    //   setParsed(copyParse);

    //   const copyStatus = status;
    //   copyStatus[topic_id-1] = token
    //   setStatus(copyStatus)
    //   userDataCopy.links = JSON.stringify(parsed);
    //   setUserData(userDataCopy);

    //   setStepData(copyData);
    // } else if (token === "unvisited") {
    //   copyData[index].urls[subIndex][innerIndex][innerKey].status = token;

    //   const copyParse = parsed;
    //   copyParse[topic] = token;

    //   setParsed(copyParse);

    //   userDataCopy.links = JSON.stringify(parsed);
    //   setUserData(userDataCopy);
    //   console.log('hi');

    //   const copyStatus = status;
    //   copyStatus[topic_id-1] = token
    //   console.log(copyStatus);

    //   setStatus(copyStatus)
    //   console.log(status);

    //   setStepData(copyData);
    // }
  };

  return (
    <Card style={styles.container}>
      <center>
        <Card.Title className="mb-4 fw-bold display-4">User Profile</Card.Title>
      </center>
      {loading ? (
        <div className="d-flex justify-content-center my-4">
          <Spinner animation="border" role="status" variant="light">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Card.Body>
          <Container>
            {userData && (
              <Card style={styles.card}>
                <center>
                  <Card.Title className="fw-bold h5 mb-4">
                    Profile Information
                  </Card.Title>
                  <ul className="list-unstyled">
                    <li>
                      <strong className="">First Name:</strong> {userData.fname}
                    </li>
                    <li>
                      <strong className="">Last Name:</strong> {userData.lname}
                    </li>
                    <li>
                      <strong className="">Email:</strong> {userData.email}
                    </li>
                  </ul>
                </center>
              </Card>
            )}

            <Card style={styles.card}>
              <Card.Title className="fw-bold h5 mb-4">
                <center>
                  <Alert key="primary" variant="primary">
                    Your Journey to a CP Gawd!!
                  </Alert>
                </center>
              </Card.Title>
              {stepData.length > 0 &&
                stepData.map((step: StepData, index: number) => {
                  const subHeadings = step.subheadings || [];
                  return (
                    <Card style={styles.card} key={index}>
                      <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="{index}">
                          <Accordion.Header>{step.heading}</Accordion.Header>
                          <Accordion.Body>
                            {subHeadings.length > 0 &&
                              subHeadings.map(
                                (subheading: SubHeadings, subIndex: number) => {
                                  return (
                                    <Accordion
                                      defaultActiveKey={String(subIndex)}
                                      key={subheading.sub_heading_id}
                                    >
                                      <Accordion.Header>
                                        {subheading.sub_heading}
                                      </Accordion.Header>

                                      <Accordion.Body>
                                        {subheading.questions.length > 0 &&
                                          subheading.questions.map(
                                            (
                                              question: Questions,
                                              questionIndex: number
                                            ) => {
                                              return (
                                                <Card
                                                  key={questionIndex}
                                                  style={styles.card}
                                                >
                                                  <center>
                                                    <Card.Title className="fw-bold h5 mb-4">
                                                      {question.topic}
                                                    </Card.Title>
                                                  </center>

                                                  <ul className="list-unstyled">
                                                    <li>
                                                      {/* <Button
                                                        style={styles.button}
                                                        variant="outline-light"
                                                      >
                                                        {question.link ===
                                                        "NO-URL" ? (
                                                          <a
                                                            href=""
                                                            target="_blank"
                                                            style={styles.link}
                                                          >
                                                            NO-URL available
                                                          </a>
                                                        ) : (
                                                          <a
                                                            href={question.link}
                                                            target="_blank"
                                                            style={styles.link}
                                                          >
                                                            Solve
                                                          </a>
                                                        )}
                                                      </Button> */}
                                                      {question.link ===
                                                      "NO-URL" ? (
                                                        <center>
                                                          <div>
                                                            NO-URL available
                                                          </div>
                                                        </center>
                                                      ) : (
                                                        <>
                                                          <Button
                                                            style={
                                                              // styles.button,
                                                              {
                                                                position:
                                                                  "absolute",
                                                                left: "10px",
                                                                bottom: "10px",
                                                              }
                                                            }
                                                            variant="outline-light"
                                                          >
                                                            <a
                                                              href={
                                                                question.link
                                                              }
                                                              target="_blank"
                                                              style={{
                                                                color:
                                                                  "#61dafb",
                                                              }}
                                                            >
                                                              Solve
                                                            </a>
                                                          </Button>
                                                        </>
                                                      )}

                                                      <br />
                                                      <DropdownButton
                                                        style={{
                                                          color: "#61dafb",
                                                          position: "absolute",
                                                          right: "10px",
                                                          bottom: "10px",

                                                          textDecoration:
                                                            "none",
                                                        }}
                                                        variant="outline-light"
                                                        title={
                                                          status[
                                                            question.topic_id -
                                                              1
                                                          ]
                                                        }
                                                      >
                                                        <Dropdown.Item
                                                          style={{
                                                            color: "#61dafb",
                                                          }}
                                                          onClick={
                                                            () => {
                                                              status_click(
                                                                "Visited",
                                                                index,
                                                                subIndex,
                                                                question.topic_id
                                                                // innerIndex,
                                                                // innerKey,
                                                                // topic
                                                              );
                                                              SaveClick();
                                                              console.log(
                                                                question.topic_id
                                                              );
                                                            }
                                                            // setStatus("visited")
                                                          }
                                                        >
                                                          Visited
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                          style={{
                                                            color: "#61dafb",
                                                          }}
                                                          onClick={() => {
                                                            status_click(
                                                              "Unvisited",
                                                              index,
                                                              subIndex,
                                                              question.topic_id
                                                              // innerIndex,
                                                              // innerKey,
                                                              // topic
                                                            );
                                                            // SaveClick();
                                                            console.log(
                                                              question.topic_id
                                                            );
                                                          }}
                                                        >
                                                          Unvisited
                                                        </Dropdown.Item>
                                                      </DropdownButton>
                                                    </li>
                                                  </ul>
                                                </Card>
                                              );
                                            }
                                          )}
                                      </Accordion.Body>
                                    </Accordion>
                                  );
                                }
                              )}
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </Card>
                  );
                })}
            </Card>
          </Container>
        </Card.Body>
      )}
    </Card>
    // <Fab
    //   sx={fab.sx}
    //   aria-label={fab.label}
    //   color={fab.color}
    //   onClick={SaveClick}
    // >
    //   {fab.icon}
    // </Fab>
  );
}
