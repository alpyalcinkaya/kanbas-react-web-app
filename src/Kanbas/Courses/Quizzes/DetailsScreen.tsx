import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import * as quizClient from "./client";

export default function QuizEdirot() {
    // get quiz ids
    const { cid, aid } = useParams<{ cid: string; aid?: string }>();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // check if the quiz is being edited currently
    const isEditing = Boolean(aid);

    // get fields that need to be changed for the quiz.  Use state to manage the input fields
    
    // textual input fields
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [points, setPoints] = useState("100");
    const [shuffleAnswers, setShuffle] = useState("Yes");
    const [timeLimit, setTimeLimit] = useState("20");
    const [accesCode, setAccesCode] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [availableDate, setAvailableDate] = useState("");
    const [untilDate, setUntilDate] = useState("");

    // check box
    const [multipleAttemps, setAttemps] = useState(false);
    const [numberAttemps, setNumberOfAttemps] = useState("1");
    const [showCorrectAnswers, setShowAnswer] = useState(false);
    const [oneAtATime, setOneAtATime] = useState(true);
    const [webCam, setWebCam] = useState(false);
    const [lockQuestionsAfterAnswering, setLockQuestions] = useState(false);

    // drop down 
    const [assignmentGroup, setAssignmentGroup] = useState("QUIZZES");
    const [displayGradeAs, setDisplayGradeAs] = useState("PERCENTAGE");
    const [submissionType, setSubmissionType] = useState("ONLINE");
    const [quizType, setQuizType] = useState("Graded Quiz");
}