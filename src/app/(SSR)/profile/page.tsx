"use client";
import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Spinner,
  Container,
  Collapse,
  DropdownButton,
  Dropdown,
  Alert,
  Accordion,
} from "react-bootstrap";
import SaveIcon from "@mui/icons-material/Save";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import { useCookies } from "react-cookie";
import { toast } from "react-hot-toast";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import data from "./data.json";

import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "next/navigation";
import { ElevatorSharp } from "@mui/icons-material";
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
  sub_headings: string[];
  urls: any;
}
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
    const endpoint = "http://clasherrox.pythonanywhere.com/api/auth/profile";
    const data = {
      username: userData?.username,
      links: userData?.links,
    };
    const options = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + cookies["token"],
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(endpoint, options);
    if (response.ok) {
      toast("your progress has been saved");
      router.push("/profile");
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      const endpoint = "http://clasherrox.pythonanywhere.com/api/auth/profile";
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

          var d1 = JSON.parse(obj.links);
          setParsed(d1);
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
    const parsedData: StepData[] = Object.values(data).map((step: any) => ({
      heading: step.heading,
      sub_headings: step.sub_headings,
      urls: step.urls,
    }));

    setStepData(parsedData);

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

    if (token == "visited") {
      copyData[index].urls[subIndex][innerIndex][innerKey].status = token;

      const copyParse = parsed;

      copyParse[topic] = token;

      setParsed(copyParse);

      userDataCopy.links = JSON.stringify(parsed);
      setUserData(userDataCopy);

      setStepData(copyData);
    } else if (token == "unvisited") {
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
      <Card className="p-4 bg-dark">
        <Card.Body>
          <Card.Title className="mb-4  fw-bold display-4">
            User Profile
          </Card.Title>

          {loading ? (
            <div className="d-flex justify-content-center my-4">
              <Spinner animation="border" role="status" variant="light">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Container>
              {userData && (
                <Card className="border border-light p-4 mb-4">
                  <Card.Title className=" fw-bold h5 mb-4">
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
                </Card>
              )}

              <Card className="border border-light p-4">
                <Card.Title className=" fw-bold h5 mb-4">
                  <Alert key="primary" variant="primary">
                    Save your progress before leaving by clicking the button in
                    bottom right
                  </Alert>
                </Card.Title>
                {stepData.length > 0 &&
                  stepData.map((step: StepData, index: number) => {
                    const subHeadings = step.sub_headings || [];
                    const urls = step.urls || [];

                    return (
                      <Card
                        className="border border-light p-4 mb-4"
                        key={index}
                      >
                        <Accordion defaultActiveKey="0">
                          <Accordion.Item eventKey="{index}">
                            <Accordion.Header>{step.heading}</Accordion.Header>
                            <Accordion.Body>
                              {subHeadings.length > 0 &&
                                subHeadings.map(
                                  (subHeading: string, subIndex: number) => {
                                    const urlData: UrlData[] =
                                      urls[subIndex] || [];
                                    return (
                                      <Accordion defaultActiveKey="0">
                                        <Accordion.Header>
                                          {subHeading}
                                        </Accordion.Header>
                                        <Accordion.Body>
                                          {urlData.length > 0 &&
                                            urlData.map(
                                              (
                                                urlObj: any,
                                                innerIndex: number
                                              ) => {
                                                const innerKey =
                                                  Object.keys(urlObj)[0];

                                                let { topic, link, status } =
                                                  urlObj[innerKey];
                                                status =
                                                  parsed == null
                                                    ? status
                                                    : parsed[topic];
                                                return (
                                                  <Card
                                                    className="border border-light p-4 mb-4"
                                                    key={innerIndex}
                                                  >
                                                    <Card.Title className=" fw-bold h5 mb-4">
                                                      {topic}
                                                    </Card.Title>
                                                    <ul className="list-unstyled">
                                                      <li>
                                                        <Button
                                                          className="my-4 btn btn-outline-light"
                                                          variant="outline-light"
                                                        >
                                                          {link == "NO-URL" ? (
                                                            <a
                                                              href=""
                                                              target="_blank"
                                                            >
                                                              NO-URL available
                                                            </a>
                                                          ) : (
                                                            <a
                                                              href={link}
                                                              target="_blank"
                                                            >
                                                              Solve
                                                            </a>
                                                          )}
                                                        </Button>
                                                        <br />
                                                        <DropdownButton
                                                          className="btn btn-outline-light"
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
