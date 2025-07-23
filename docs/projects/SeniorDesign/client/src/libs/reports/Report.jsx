import React from "react";
import "../../libs/style/Report.css";
import html2pdf from "html2pdf.js";
import { useParams } from "react-router-dom";
import TreeReport from "./TreeReport";
import ConeReport from "./ConeReport";
import SeedReport from "./SeedReport";

function Report() {
  const downloadPDF = () => {
    const element = document.getElementById("pdf-element"); // the id of the component you want to download as PDF
    const opt = {
      margin: 0.5,
      filename: "myfile.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  const { type, id } = useParams();

  let content;

  switch (type) {
    case "tree":
      content = <TreeReport id={id} type={type} />;
      break;
    case "cone":
      content = <ConeReport id={id} type={type} />;
      break;
    case "seed":
      content = <SeedReport id={id} type={type} />;
      break;
    default:
      content = (
        <div id="pdf-element" className="pdf-div">
          <h2>PDF Element</h2>
          <p>Report not found</p>
        </div>
      );
      break;
  }

  return (
    <div className="content-div-report">
      <h1>Report</h1>
      { content }
      <div className="button-div-report">
        <button id="pdf-button" onClick={downloadPDF}>
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default Report;
