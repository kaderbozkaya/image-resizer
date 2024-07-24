import React, { useState, useRef } from "react";
import ".//App.css";
import { FaUpload } from "react-icons/fa6";
import logo from "./assets/unnamed.png";

const App = () => {
  const [image, setImage] = useState(null);
  const [width, setWidth] = useState(0); //genişliği set etmek için
  const [height, setHeight] = useState(0); //yüksekliği set etmek için
  const originalWidthToHeightRatio = useRef(1); //orijinal genişlik yükseklik oranını saklamak için referans
  const canvasRef = useRef(null);

  //seçilen dosyayı okur ve openImage fonksiyonunu çağırarak resmi açar.
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => openImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  //yüklenen resmi bir Image nesnesi olarak açar, orijinal genişlik/yükseklik oranını kaydeder ve resmi yeniden boyutlandırır.

  const openImage = (src) => {
    const img = new Image();
    img.onload = () => {
      originalWidthToHeightRatio.current = img.width / img.height;
      setWidth(img.width);
      setHeight(img.height);
      resizeImage(img.width, img.height);
    };
    img.src = src;
    setImage(img);
  };
  //görseli verilen yeni genişlik ve yükseklik ile yeniden boyutlandırır ve canvasa çizer

  const resizeImage = (newWidth, newHeight) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.drawImage(image, 0, 0, newWidth, newHeight);
  };
  //görseli yeni genişlikle yeniden boyutlandırır.
  const handleWidthChange = (event) => {
    const newWidth = Number(event.target.value);
    setWidth(newWidth);
    resizeImage(newWidth, height);
  };
  //görseli yeni yükseklikle yeniden boyutlandırır.
  const handleHeightChange = (event) => {
    const newHeight = Number(event.target.value);
    setHeight(newHeight);
    resizeImage(width, newHeight);
  };
  //Görseli indirmek için

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "resized-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
  return (
    <>
      <div className="header">
        <div className="logo">
          <img src={logo} alt="" className="logo-image" />
          <p>Canvas Image Resizer</p>
        </div>
        <div className="links">
          <a href="">Blog</a>
          <a href="">How it works?</a>
          <a href="">Contact Us</a>
        </div>
      </div>
      <h1>Resize an image</h1>
      <p>
        Resize JPG, PNG, SVG or GIF by defining new height and width pixels.
        Change image dimensions in bulk.
      </p>
      <div className="resizer">
        <input
          type="file"
          className="resizer__file"
          onChange={handleFileChange}
        />

        <div className="dimensions">
          <input
            type="number"
            className="resizer__input resizer__input--width"
            value={width}
            onChange={handleWidthChange}
          />
          x
          <input
            type="number"
            className="resizer__input resizer__input--height"
            value={height}
            onChange={handleHeightChange}
          />
        </div>
        {!image && <FaUpload className="upload-icon" />}
        <div className="image-and-btn">
          <canvas ref={canvasRef} className="canvas"></canvas>
          <button onClick={downloadImage} className="btn">
            Download Image
          </button>
        </div>
      </div>
    </>
  );
};

export default App;
