import { useState } from "react";
import { QrReader } from "react-qr-reader";
import "../style/QRCodeReader.css";
import { useNavigate } from "react-router-dom";

const QRCodeReader = () => {
  const [data, setData] = useState("");
  const [isDivVisible, setIsDivVisible] = useState(false);
  const [result, setResult] = useState("");
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  const navigate = useNavigate();

  const toggleDivVisibility = () => {
    setIsDivVisible(!isDivVisible);
  };

  const handleScan = (scanData) => {
    if (scanData) {
      setData(scanData);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleResult = (input) => {
    console.log("Input:" + input);
    
    //check if input is underfined
    if (input === undefined || input === null) {
      return;
    }
    else {
      setResult(input);
      setIsButtonVisible(true);
    }

  };

  const goToReport = () => {
    console.log("Go to report");
    //window.location.href = "/report" + result;
    navigate("/report" + result);
  };

  return (
    <div class="form-div">
      <div>
        <h1>QR Code Reader</h1>
        <button className="qr-button" onClick={toggleDivVisibility}>Toggle Camera</button>
        {isButtonVisible && <h3>{"Current input: " + result}</h3>}
        {isButtonVisible && <button className="qr-button" onClick={goToReport}>Go to report</button>}
      </div>

      <div className="camera-div" style={{ width: "100%", borderRadius: "10px" }}>
        {isDivVisible && (
          <QrReader
            delay={1000}
            onError={handleError}
            onScan={handleScan}
            onResult={handleResult}
            style={{ width: "100%" }}
          />
        )}
        <p>{data}</p>
      </div>
    </div>
  );
};

export default QRCodeReader;
