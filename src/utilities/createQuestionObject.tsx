import { fetchQuestionData } from "@/api/fetchQuestionData";

export const createQuestions = async () => {
  const response = await fetchQuestionData();

  const stepData = response.data.questions.reduce((acc, question) => {
    const {
      heading,
      heading_id,
      sub_heading,
      sub_heading_id,
      link,
      topic_id,
      topic,
    } = question;
    let headingObj = acc.find((item) => item.heading_id === heading_id);
    if (!headingObj) {
      headingObj = { heading_id, heading, subheadings: [] };
      acc.push(headingObj);
    }
    let subheadingObj = headingObj.subheadings.find(
      (item) => item.sub_heading_id === sub_heading_id
    );
    if (!subheadingObj) {
      subheadingObj = { sub_heading_id, sub_heading, questions: [] };
      headingObj.subheadings.push(subheadingObj);
    }
    subheadingObj.questions.push({ topic_id, link, topic });
    return acc;
  }, []);

  return stepData;
};
