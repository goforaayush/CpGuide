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
  Form,
  Modal,
} from "react-bootstrap";
import { useCookies } from "react-cookie";
import { toast } from "react-hot-toast";
import { createQuestions } from "@/utilities/createQuestionObject";
import { fetchProfileData } from "@/api/fetchProfileData";
import { saveUserVisit } from "@/api/saveUserVisit";
import { deleteUserVisit } from "@/api/deleteUserVisit";
import { getUserVisit } from "@/api/getUserVisit";
import { getUserNote } from "@/api/getUserNote";
import { updateUserNote } from "@/api/updateUserNote";
import { deleteUserNote } from "@/api/deleteUserNote";
import { useMediaQuery } from "react-responsive";

interface UserData {
  username: string;
  email: string;
  fname: string;
  lname: string;
  links: string;
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

//better to create a css file for this
const styles = {
  container: {
    
    background: "#1a1a1a",
    color: "#fff",
    padding: "20px",
    minHeight: "100vh"
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
  const [stepData, setStepData] = useState<StepData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState(Array(16).fill("Unvisited"));
  const [noteBoxState, setnoteBoxState] = useState(Array(status.length).fill(false));
  const [note, setNote] = useState("");

  const isBigger = useMediaQuery({ query: "(min-width: 1401px)" });
  const isMediumMax = useMediaQuery({ query: "(max-width: 1400px)" });
  const isMediumMin = useMediaQuery({ query: "(min-width: 1201px)" });
  const isDesktopOrLaptopMax = useMediaQuery({ query: "(max-width: 1200px)" });
  const isDesktopOrLaptopMin = useMediaQuery({ query: "(min-width: 992px)" });
  const isTabletMin = useMediaQuery({ query: "(min-width: 780px)" });
  const isTabletMax = useMediaQuery({ query: "(max-width: 991px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 779px)" });

  useEffect(() => {
    const setProfileData = async () => {
      try {
        const response = await fetchProfileData(cookies["token"]);
        const data = JSON.parse(response.data);
        let obj: UserData = data;
        if (response.status === 200) {
          setUserData(obj);
        }
        console.log(obj.username);
        try {
          const visitResponse = await getUserVisit(
            cookies["token"],
            obj.username
          );
          const visitData = visitResponse.data;
          console.log(visitData["visited questions"]);
          const visitJSON = visitData["visited questions"];
          let copyStatus = status;
          for (let visit in visitJSON) {
            console.log(parseInt(visitJSON[visit].topicId));
            copyStatus[parseInt(visitJSON[visit].topicId) - 1] = "Visited";
          }
          console.log(copyStatus);
          
          setStatus([...copyStatus]);
        } catch (error) {
          console.log(error);
          toast.error("Error fetching Visit Data");
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
      const questions = await createQuestions(cookies["token"]);
      setStepData(questions);
    };
    fetchQuestions();
    setLoading(false);
  }, []);

  const SaveClick = async (topic_id: number) => {
    const data = {
      topic_id: topic_id, // change this later
      user: userData?.username,
    };
    try {
      const response = await saveUserVisit(cookies["token"], data);
    } catch (error) {
      console.log(error);
    }
  };

  const DeleteVisit = async (topic_id: number) => {
    const data = {
      topic_id: topic_id, // change this later
      user: userData?.username,
    };
    try {
      const response = await deleteUserVisit(cookies["token"], data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelect = (e: string, index: number) => {
    console.log(e);
    let copyStatus = [...status];
    copyStatus[index - 1] = e;
    setStatus(copyStatus);
    if (e == "Visited") SaveClick(index);
    else DeleteVisit(index);
  };
  const handleNoteBox = (id: number) => {
    let copyNoteBoxState = noteBoxState;
    copyNoteBoxState[id - 1] = !copyNoteBoxState[id - 1];
    setnoteBoxState([...copyNoteBoxState]);
  };

  const handleNoteSave = async (topic_id: number, note: string) => {
    const data = {
      user: userData!.username,
      topic_id: topic_id,
      note: note,
    };
    if (note != "") {
      const response = await updateUserNote(cookies["token"], data);
      console.log(response.data);
    } else {
      const response = await deleteUserNote(cookies["token"], data);
      console.log(response.data);
    }
  };

  const getNote = async (topic_id: number) => {
    console.log(topic_id);

    const noteResponse = await getUserNote(
      cookies["token"],
      userData!.username,
      topic_id
    );

    if (noteResponse.data.user_notes.length == 1) {
      const notes = noteResponse.data.user_notes[0].note;
      console.log(notes);
      setNote(notes);
    }
  };
  return (
    
    <div style={styles.container}>
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
                                                      <>
                                                        {isMobile && (
                                                          <center>
                                                            <Button
                                                              variant="outline-light"
                                                              onClick={() => {
                                                                handleSelect(
                                                                  "Visited",
                                                                  question.topic_id
                                                                );
                                                              }}
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
                                                          </center>
                                                        )}
                                                        {isTabletMin && (
                                                          <Button
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              left: "1%",
                                                              bottom: "10px",
                                                            }}
                                                            variant="outline-light"
                                                            onClick={() => {
                                                              handleSelect(
                                                                "Visited",
                                                                question.topic_id
                                                              );
                                                            }}
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
                                                        )}
                                                      </>
                                                      <br />
                                                      <Container
                                                        style={{
                                                          position: "relative",
                                                        }}
                                                      >
                                                        {isMobile && (
                                                          <center>
                                                            <Button
                                                              variant="outline-light"
                                                              onClick={() => {
                                                                handleNoteBox(
                                                                  question.topic_id
                                                                );
                                                                setNote("");
                                                              }}
                                                            >
                                                              Make a Note
                                                            </Button>
                                                          </center>
                                                        )}
                                                        {isMediumMax &&
                                                          isMediumMin && (
                                                            <Button
                                                              style={{
                                                                position:
                                                                  "absolute",
                                                                right: "12.5%",
                                                                bottom: "-5px",
                                                              }}
                                                              variant="outline-light"
                                                              onClick={() => {
                                                                handleNoteBox(
                                                                  question.topic_id
                                                                );
                                                                setNote("");
                                                              }}
                                                            >
                                                              Make a Note
                                                            </Button>
                                                          )}
                                                        {isDesktopOrLaptopMax &&
                                                          isDesktopOrLaptopMin && (
                                                            <Button
                                                              style={{
                                                                position:
                                                                  "absolute",
                                                                right: "15%",
                                                                bottom: "-5px",
                                                              }}
                                                              variant="outline-light"
                                                              onClick={() => {
                                                                handleNoteBox(
                                                                  question.topic_id
                                                                );
                                                                setNote("");
                                                              }}
                                                            >
                                                              Make a Note
                                                            </Button>
                                                          )}
                                                        {isBigger && (
                                                          <Button
                                                            style={{
                                                              position:
                                                                "absolute",
                                                              right: "10.5%",
                                                              bottom: "-5px",
                                                            }}
                                                            variant="outline-light"
                                                            onClick={() => {
                                                              handleNoteBox(
                                                                question.topic_id
                                                              );
                                                              setNote("");
                                                            }}
                                                          >
                                                            Make a Note
                                                          </Button>
                                                        )}
                                                        {isTabletMax &&
                                                          isTabletMin && (
                                                            <Button
                                                              style={{
                                                                position:
                                                                  "absolute",
                                                                right: "20%",
                                                                bottom: "-5px",
                                                              }}
                                                              variant="outline-light"
                                                              onClick={() => {
                                                                handleNoteBox(
                                                                  question.topic_id
                                                                );
                                                                setNote("");
                                                              }}
                                                            >
                                                              Make a Note
                                                            </Button>
                                                          )}
                                                        <Modal
                                                          centered
                                                          show={
                                                            noteBoxState[
                                                              question.topic_id -
                                                                1
                                                            ]
                                                          }
                                                          onShow={() => {
                                                            getNote(
                                                              question.topic_id
                                                            );
                                                          }}
                                                          onHide={() => {
                                                            handleNoteBox(
                                                              question.topic_id
                                                            );
                                                          }}
                                                        >
                                                          <Modal.Header
                                                            closeButton
                                                          >
                                                            <Modal.Title className="text-white">
                                                              Make a Note
                                                            </Modal.Title>
                                                          </Modal.Header>
                                                          <Modal.Body>
                                                            <Form>
                                                              <Form.Group
                                                                className="mb-3"
                                                                controlId="exampleForm.ControlTextarea1"
                                                              >
                                                                <Form.Control
                                                                  type="text"
                                                                  placeholder="Note Here..."
                                                                  autoFocus
                                                                  as="textarea"
                                                                  rows={10}
                                                                  value={note}
                                                                  onChange={(
                                                                    e
                                                                  ) => {
                                                                    setNote(
                                                                      e.target
                                                                        .value
                                                                    );
                                                                    console.log(
                                                                      note
                                                                    );
                                                                  }}
                                                                />
                                                              </Form.Group>
                                                            </Form>
                                                          </Modal.Body>
                                                          <Modal.Footer>
                                                            <div
                                                              style={{
                                                                color: "white",
                                                                cursor:
                                                                  "pointer",
                                                              }}
                                                              onClick={() => {
                                                                handleNoteBox(
                                                                  question.topic_id
                                                                );
                                                              }}
                                                            >
                                                              Close
                                                            </div>
                                                            <Button
                                                              variant="outline-light"
                                                              onClick={() => {
                                                                handleNoteSave(
                                                                  question.topic_id,
                                                                  note
                                                                );
                                                                handleNoteBox(
                                                                  question.topic_id
                                                                );
                                                                console.log(
                                                                  note
                                                                );
                                                              }}
                                                            >
                                                              Save Changes
                                                            </Button>
                                                          </Modal.Footer>
                                                        </Modal>
                                                        <br />
                                                        {isMobile && (
                                                          <center>
                                                            <DropdownButton
                                                              style={{
                                                                color:
                                                                  "#61dafb",
                                                                textDecoration:
                                                                  "none",
                                                              }}
                                                              onSelect={(e) =>
                                                                handleSelect(
                                                                  e!,
                                                                  question.topic_id
                                                                )
                                                              }
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
                                                                  color:
                                                                    "#61dafb",
                                                                }}
                                                                eventKey="Visited"
                                                              >
                                                                Visited
                                                              </Dropdown.Item>
                                                              <Dropdown.Item
                                                                eventKey="Unvisited"
                                                                style={{
                                                                  color:
                                                                    "#61dafb",
                                                                }}
                                                              >
                                                                Unvisited
                                                              </Dropdown.Item>
                                                            </DropdownButton>
                                                          </center>
                                                        )}
                                                        {isTabletMin && (
                                                          <DropdownButton
                                                            style={{
                                                              color: "#61dafb",
                                                              position:
                                                                "absolute",
                                                              right: "1%",
                                                              bottom: "-5px",
                                                              textDecoration:
                                                                "none",
                                                            }}
                                                            onSelect={(e) =>
                                                              handleSelect(
                                                                e!,
                                                                question.topic_id
                                                              )
                                                            }
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
                                                                color:
                                                                  "#61dafb",
                                                              }}
                                                              eventKey="Visited"
                                                            >
                                                              Visited
                                                            </Dropdown.Item>
                                                            <Dropdown.Item
                                                              eventKey="Unvisited"
                                                              style={{
                                                                color:
                                                                  "#61dafb",
                                                              }}
                                                            >
                                                              Unvisited
                                                            </Dropdown.Item>
                                                          </DropdownButton>
                                                        )}
                                                      </Container>
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
    </div>
  );
}
