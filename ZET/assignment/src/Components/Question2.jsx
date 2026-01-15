import { useState } from "react";

export function FileUpload() {
  let [file, setFile] = useState("");
  let [error, setError] = useState("");
  let [loading, setLoading] = useState(false);
  let [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true)

    if (!file) {
      setError("File not uploaded");
      return;
    }

    let formData = new FormData();
    formData.append("image", file);

    try {
      let res = await fetch(
        "https://api.imgbb.com/1/upload?key=1b44446ae255187b63eb47b5be3a8ef5",
        {
          method: "POST",
          body: formData,
        }
      );
      if (!res.ok) {
        setError("not correct file");
      }
      let data = await res.json();
      if (!data.success) {
        setError("File not Uploaded");
      }

      setMessage("File Uploades SucessFully✅");

      console.log(data);
    } catch (error) {
        setError(error.message)
        setLoading(false);
    }
  }

  return (
    <>
   <div style={{border:"1px solid", padding:"20px", marginTop:"20px"}}>
     <h2>Second Assignment</h2>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          placeholder="Upload File"
        />
        <button type="submit" disabled={loading}>Upload</button>
      </form>

      {error && <p style={{color:"red"}}>{error}</p>}
      {message && <p style={{color:"green"}}>{message}</p>}
   </div>
    </>
  );
}
