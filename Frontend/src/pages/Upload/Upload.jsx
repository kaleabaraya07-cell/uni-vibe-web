import { useEffect } from "react";
import { useUpload } from "../../context/UploadContext";

function Upload() {
  const { openUpload } = useUpload();

  useEffect(() => {
    openUpload();
  }, [openUpload]);

  return null;
}

export default Upload;
