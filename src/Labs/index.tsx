import React from 'react';
import Lab1 from "./Lab1";
import TOC from "./TOC";
import Lab2 from "./Lab2";
import Lab3 from "./Lab3";

import { Route, Routes, Navigate } from "react-router";


export default function Labs() {
  return (
    <div id="wd-labs">
      <h1>Alp Yalcinkaya</h1>
      <TOC />
      <Routes>
        <Route path="/" element={<Navigate to="Lab1" />} />
        <Route path="Lab1" element={<Lab1 />} />
        <Route path="Lab2" element={<Lab2 />} />
        <Route path="Lab3" element={<Lab3 />} />
      </Routes>
    </div>
);}
