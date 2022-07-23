import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { storage } from "../utils/Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

const Title = styled.div`
  font-size: 1.5rem;
  color: black;
`;

const ImageInput = styled.input`
  width: auto;
  height: auto;
  background-color: white;
`;

const UploadButton = styled.button`
  width: 100px;
  height: 50px;
`;

const Image = () => {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageToShow, setImageToShow] = useState(null);
  const imageRef = ref(
    storage,
    "photos/paulius-andriekus-mHl0mAeMS04-unsplash.jpge328e5ab-c542-4fc9-adf3-94d656438ba0"
  );

  const downloadImage = async () => {
    const a = await getDownloadURL(imageRef);
    setImageToShow(a);
  };

  useEffect(() => {
    downloadImage();
  }, []);

  const handleImageInput = (e) => {
    setImageUpload(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (imageUpload !== null) {
      const imageRef = ref(storage, `photos/${imageUpload.name + v4()}`);
      await uploadBytes(imageRef, imageUpload);
      alert("image uploaded");
    }
  };

  return (
    <>
      {console.log(imageUpload)}
      <Title>Upload</Title>
      <ImageInput type="file" onChange={handleImageInput} />
      <UploadButton onClick={uploadImage}>Upload</UploadButton>
      {<img src={imageToShow} />}
    </>
  );
};

export default Image;
