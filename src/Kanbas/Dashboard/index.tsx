import React from "react";
import { Link } from "react-router-dom";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course"> {/* Web Dev */}
          <img src="/images/reactjs.jpg" width={200} />
          <div>
            <Link className="wd-dashboard-course-link"
              to="/Kanbas/Courses/1234/Home">
              CS1234 React JS
            </Link>
            <p className="wd-dashboard-course-title">
              Full Stack software developer
            </p>
            <Link to="/Kanbas/Courses/1234/Home"> Go </Link>
          </div>
        </div>

        <div className="wd-dashboard-course"> {/* Foundations of AI*/}
            <img src="/images/ai.jpg" width={200} />
            <div>
                <Link className="wd-dashboard-course-link" to="/Kanbas/Courses/5100/Home">
                    CS5100 AI
                </Link>
                <p className="wd-dashboard-course-title">
                    Foundations of AI
                </p>
                <Link to="/Kanbas/Courses/5100/Home"> Go </Link>
            </div>
        </div>

        <div className="wd-dashboard-course">  {/* Game Programming */}
            <img src="/images/gameprog.jpg" width={200} />
            <div>
                <Link className="wd-dashboard-course-link" to="/Kanbas/Courses/5540/Home">
                    CS5540 Game Programming
                </Link>
                <p className="wd-dashboard-course-title">
                    Intro to Game Programming
                </p>
                <Link to="/Kanbas/Courses/5540/Home"> Go </Link>
            </div>
        </div>

        <div className="wd-dashboard-course">  {/* Discrete Structures */}
            <img src="/images/discrete.jpg" width={200} />
            <div>
                <Link className="wd-dashboard-course-link" to="/Kanbas/Courses/5002/Home">
                    CS5002 Discrete Structures 
                </Link>
                <p className="wd-dashboard-course-title">
                    Discrete Structures
                </p>
                <Link to="/Kanbas/Courses/5002/Home"> Go </Link>
            </div>
        </div>

        <div className="wd-dashboard-course">  {/* Algorithms */}
            <img src="/images/algo.jpg" width={200} />
            <div>
                <Link className="wd-dashboard-course-link" to="/Kanbas/Courses/5800/Home">
                    CS5800 Algorithms
                </Link>
                <p className="wd-dashboard-course-title">
                    Algorithms
                </p>
                <Link to="/Kanbas/Courses/5800/Home"> Go </Link>
            </div>

        </div>

        <div className="wd-dashboard-course">  {/* Object Oriented Programming */}
            <img src="/images/oop.jpg" width={200} />
            <div>
                <Link className="wd-dashboard-course-link" to="/Kanbas/Courses/5004/Home">
                    CS5004 Java
                </Link>
                <p className="wd-dashboard-course-title">
                    Object Oriented Programming
                </p>
                <Link to="/Kanbas/Courses/5004/Home"> Go </Link>
            </div>

        </div>
        
        <div className="wd-dashboard-course">  {/* Intro to Cybersecurity CY 5770*/}
            <img src="/images/cybersecurity.jpg" width={200} />
            <div>
                <Link className="wd-dashboard-course-link" to="/Kanbas/Courses/5770/Home">
                    CS5770 Cybersecurity 
                </Link>
                <p className="wd-dashboard-course-title">
                    Introduction to Cybersecurity
                </p>
                <Link to="/Kanbas/Courses/5770/Home"> Go </Link>
            </div>

        </div>


      </div>
    </div>
  );
}
