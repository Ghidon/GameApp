import React, { useState, useEffect } from "react";
import { uploadImage } from "./Account/UserFunctions";

export const Upload = () => {
  const [selectedFile, setselectedFile] = useState(null);

  const fileSelectedHandler = (event) => {
    setselectedFile(event.target.files[0]);
  };

  const fileUploadHandler = () => {
    uploadImage(selectedFile);

    // const fd = new FormData();
    // fd.append("image", selectedFile, selectedFile.name);
    // axios.post("users/image", fd).then((res) => {
    //   console.log(res);
    // });
  };

  return (
    <div>
      <input type="file" onChange={fileSelectedHandler}></input>
      <button onClick={fileUploadHandler}>Upload</button>
    </div>
  );
};
