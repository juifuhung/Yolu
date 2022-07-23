import React, { useState } from "react";
import styled from "styled-components";
import { storage } from "../utils/Firebase";
import { ref, uploadBytes } from "firebase/storage";
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
  const imageRef = ref(storage, "photos/");

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
    </>
  );
};

export default Image;
