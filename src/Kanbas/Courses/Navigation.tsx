import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";

export default function CoursesNavigation() {
  const links = [
    "Home",
    "Modules",
    "Piazza",
    "Zoom",
    "Assignments",
    "Quizzes",
    "Grades",
    "People",
  ];
  const { cid } = useParams();
  const { pathname } = useLocation();

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => {
        const path = `/Kanbas/Courses/${cid}/${link}`;
        const isActive = pathname.includes(link);
        return (
          <Link
            key={link}
            to={path}
            className={`list-group-item border border-0 ${
              isActive ? "active text-black" : "text-danger"
            }`}
          >
            {link}
          </Link>
        );
      })}
    </div>
  );
}
