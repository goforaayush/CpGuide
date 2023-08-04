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
  heading: string;
  subheadings: SubHeadings;
  links: any;
}

interface SubHeadings {
  map(arg0: (subheading: SubHeadings, subIndex: number) => import("react").JSX.Element): import("react").ReactNode;
  length: number;
  sub_heading: string;
  sub_heading_id: number;
  questions: Questions;
}

interface Questions {
  length: number;
  map(arg0: (urlObj: any, innerIndex: number) => import("react").JSX.Element): import("react").ReactNode;
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
  const [status, setStatus] = useState("unvisited");
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

  const SaveClick = async () => {
    const endpoint ="http://localhost:8000/api/auth/profile";
    const options = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + cookies["token"],
        "Content-Type": "application/json",
      },
      body: JSON.stringify({topic_id : "11B"}),   //this needs to be modified later
    };
    const response = await fetch(endpoint, options);
    if (response.ok) {
      toast("Your progress has been saved");
      router.push("/profile");
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      const endpoint = "http://localhost:8000/api/auth/profile";
      const options = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + cookies["token"],
        },
      };

      try {
        const response = await fetch(endpoint, options);
        const data = await response.json();
        let obj: UserData = await JSON.parse(data);

        if (response.ok) {
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

    fetchProfileData();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetchQuestionData()

      const stepData =  response.data.questions.reduce((acc, question) => {
        const { heading, heading_id, sub_heading, sub_heading_id, link, topic_id } = question;
  
        let headingObj = acc.find((item) => item.heading_id === heading_id);
        if (!headingObj) {
          headingObj = { heading_id, heading, subheadings: [] };
          acc.push(headingObj);
        }
    
 
        let subheadingObj = headingObj.subheadings.find((item) => item.sub_heading_id === sub_heading_id);
        if (!subheadingObj) {
          subheadingObj = { sub_heading_id, sub_heading, questions: [] };
          headingObj.subheadings.push(subheadingObj);
        }
    
    
        subheadingObj.questions.push({ topic_id, link });
    
      
        setStepData(acc)
        return acc;
      }, []);

      
    
    
    };

    fetchQuestions()

   
    setLoading(false);
  }, []);

  const status_click = (
    token: string,
    index: number,
    subIndex: number,
    innerIndex: number,
    innerKey: string,
    topic: string
  ) => {
    const copyData = [...stepData];
    const userDataCopy = userData ?? {
      username: "",
      email: "",
      fname: "",
      lname: "",
      links: "",
    };

    if (token === "visited") {
      copyData[index].urls[subIndex][innerIndex][innerKey].status = token;

      const copyParse = parsed;

      copyParse[topic] = token;

      setParsed(copyParse);

      userDataCopy.links = JSON.stringify(parsed);
      setUserData(userDataCopy);

      setStepData(copyData);
    } else if (token === "unvisited") {
      copyData[index].urls[subIndex][innerIndex][innerKey].status = token;

      const copyParse = parsed;
      copyParse[topic] = token;

      setParsed(copyParse);

      userDataCopy.links = JSON.stringify(parsed);
      setUserData(userDataCopy);

      setStepData(copyData);
    }
  };

  return (
    <center>
      <button onClick={SaveClick}> test me </button>
      <Card style={styles.container}>
        <Card.Body>
          <Card.Title className="mb-4 fw-bold display-4">User Profile</Card.Title>

          {loading ? (
            <div className="d-flex justify-content-center my-4">
              <Spinner animation="border" role="status" variant="light">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Container>
              {userData && (
                <Card style={styles.card}>
                  <Card.Title className="fw-bold h5 mb-4">Profile Information</Card.Title>
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
                </Card>
              )}

              <Card style={styles.card}>
                <Card.Title className="fw-bold h5 mb-4">
                  <Alert key="primary" variant="primary">
                    Save your progress before leaving by clicking the button in bottom right
                  </Alert>
                </Card.Title>
                {stepData.length > 0 &&
                  stepData.map((step: StepData, index: number) => {
                    const subHeadings = step.subheadings || [];
                    return (
                      <Card
                        style={styles.card}
                        key={index}
                      >
                        <Accordion defaultActiveKey="0">
                          <Accordion.Item eventKey="{index}">
                            <Accordion.Header>{step.heading}</Accordion.Header>
                            <Accordion.Body>
                              {subHeadings.length > 0 &&
                                subHeadings.map(
                                  (subheading:SubHeadings , subIndex:number) => {
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
                                                    <Card.Title className="fw-bold h5 mb-4">
                                                      {question.topic_id}
                                                    </Card.Title>
                                                    {/* <ul className="list-unstyled">
                                                      <li>
                                                        <Button
                                                          style={styles.button}
                                                          variant="outline-light"
                                                        >
                                                          {link === "NO-URL" ? (
                                                            <a
                                                              href=""
                                                              target="_blank"
                                                              style={styles.link}
                                                            >
                                                              NO-URL available
                                                            </a>
                                                          ) : (
                                                            <a
                                                              href={link}
                                                              target="_blank"
                                                              style={styles.link}
                                                            >
                                                              Solve
                                                            </a>
                                                          )}
                                                        </Button>
                                                        <br />
                                                        <DropdownButton
                                                          style={styles.button}
                                                          variant="dark"
                                                          title={status}
                                                        >
                                                          <Dropdown.Item
                                                            onClick={() => {
                                                              status_click(
                                                                "visited",
                                                                index,
                                                                subIndex,
                                                                innerIndex,
                                                                innerKey,
                                                                topic
                                                              );
                                                            }}
                                                          >
                                                            Visited
                                                          </Dropdown.Item>
                                                          <Dropdown.Item
                                                            onClick={() => {
                                                              status_click(
                                                                "unvisited",
                                                                index,
                                                                subIndex,
                                                                innerIndex,
                                                                innerKey,
                                                                topic
                                                              );
                                                            }}
                                                          >
                                                            Unvisited
                                                          </Dropdown.Item>
                                                        </DropdownButton>
                                                      </li>
                                                    </ul> */}
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
          )}
        </Card.Body>
      </Card>
      <Fab
        sx={fab.sx}
        aria-label={fab.label}
        color={fab.color}
        onClick={SaveClick}
      >
        {fab.icon}
      </Fab>
    </center>
  );
}
