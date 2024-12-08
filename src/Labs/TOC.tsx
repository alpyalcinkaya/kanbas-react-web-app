import React from "react";
import { useLocation } from "react-router";

export default function TOC() {
  const { pathname } = useLocation();
  return (
    <ul className="nav nav-pills">
      <li className="nav-item">
        <a id="wd-k" href="#/Kanbas" className="nav-link">
          Kanbas
        </a>
      </li>
      <li className="nav-item">
        <a
          id="wd-k"
          href="https://github.com/alpyalcinkaya/kanbas-react-web-app"
          className="nav-link"
        >
          Project Front-end Repo
        </a>
      </li>
      <li className="nav-item">
        <a
          id="wd-k"
          href="https://github.com/alpyalcinkaya/kanbas-node-server-app"
          className="nav-link"
        >
          Project Back-end Repo
        </a>
      </li>
    </ul>
  );
}
