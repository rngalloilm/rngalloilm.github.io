
import { useState } from 'react';
import QrCode from "react-qr-code";

function QRCodeGenerator(props) {


    return(
        <div>
            
            <QrCode value={"/" + props.type + "/" + props.id}></QrCode>
        </div>
    )
}

export default QRCodeGenerator;