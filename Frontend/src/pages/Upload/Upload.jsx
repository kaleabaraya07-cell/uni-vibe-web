import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useUpload } from "../../context/UploadContext";
import Button from "../../components/ui/Button/Button";

function Upload() {
  const { openUpload } = useUpload();

  useEffect(() => {
    openUpload();
  }, [openUpload]);

  return (
    <section className="upload-route">
      <h1>Create a campus post</h1>
      <p>Share a photo, video, or moment from university life.</p>
      <Button variant="primary" onClick={openUpload}>Open post creator</Button>
      <Link to="/feed">Back to the feed</Link>
    </section>
  );
}

export default Upload;
