import React, { useState, useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./App.css";
import { FaUpload } from "react-icons/fa";
import logo from "./assets/unnamed.png";

const App = () => {
  const [image, setImage] = useState(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const originalWidthToHeightRatio = useRef(1);
  const canvasRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => openImage(reader.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => openImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

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

  const resizeImage = (newWidth, newHeight) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.drawImage(image, 0, 0, newWidth, newHeight);
  };

  const handleWidthChange = (event) => {
    const newWidth = Number(event.target.value);
    setWidth(newWidth);
    resizeImage(newWidth, height);
  };

  const handleHeightChange = (event) => {
    const newHeight = Number(event.target.value);
    setHeight(newHeight);
    resizeImage(width, newHeight);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const canvasData = context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    ).data;

    const isEmpty = canvasData.every((pixel, index) => {
      return index % 4 === 3 ? pixel === 0 : true;
    });

    if (isEmpty) {
      alert("Canvas is empty. No image to download.");
      return;
    }

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
        {/* <input
          type="file"
          className="resizer__file"
          onChange={handleFileChange}
        /> */}

        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          {!image && <FaUpload className="upload-icon" />}
          <p>Drop your images here or browse.</p>
        </div>
        {/* {!image && <FaUpload className="upload-icon" />} */}
        <div className="image-and-btn">
          <canvas ref={canvasRef} className="canvas"></canvas>
        </div>
      </div>
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
      <button onClick={downloadImage} className="btn">
        Download Image
      </button>
    </>
  );
};

export default App;
