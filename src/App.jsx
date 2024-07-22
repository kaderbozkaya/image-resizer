import React, { useState, useRef } from "react";

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

  return (
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
      <canvas className="resizer__canvas" ref={canvasRef}></canvas>
    </div>
  );
};

export default App;
