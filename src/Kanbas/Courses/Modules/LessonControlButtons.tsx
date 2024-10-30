import React from "react";
import { FaTrash } from "react-icons/fa";
import { BsPlus } from "react-icons/bs";


import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
export default function LessonControlButtons(){
    return (
      <div className="float-end">
        <FaTrash className="text-danger me-2 mb-1"/>
        <GreenCheckmark />
        <BsPlus className="fs-1" />
        <IoEllipsisVertical className="fs-4" />
      </div>
  );}
  
