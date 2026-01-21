import { useMemo, useState } from "react";
import "./Diagnosis.css";
import logo from "../assets/logo/logo.png";

export default function Diagnosis() {
  const [petType, setPetType] = useState("dog"); // dog | cat
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState("");

  const previewUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("더미 진단 요청!");
  };

  return (
    <div className="diag-page">
      <div className="diag-card">
        <div className="diag-brand">
          <img className="diag-logo" src={logo} alt="dermavera logo" />
        </div>

        <h1 className="diag-title">Skin Diagnosis</h1>
        <p className="diag-subtitle">
          고양이 강아지의 피부사진을 찍어서 올려주세요!
        </p>

        <form className="diag-form" onSubmit={handleSubmit}>
          <div className="diag-section">
            <div className="diag-section-title">Pet</div>
            <div className="diag-toggle">
              <button
                type="button"
                className={petType === "dog" ? "diag-chip active" : "diag-chip"}
                onClick={() => setPetType("dog")}
              >
                Dog
              </button>
              <button
                type="button"
                className={petType === "cat" ? "diag-chip active" : "diag-chip"}
                onClick={() => setPetType("cat")}
              >
                Cat
              </button>
            </div>
          </div>

          <div className="diag-section">
            <div className="diag-section-title">Photo</div>

            <label className="diag-upload">
              <input
                className="diag-file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <div className="diag-upload-box">
                <div className="diag-upload-main">
                  {file ? file.name : "Click to upload a skin photo"}
                </div>
                <div className="diag-upload-sub">
                  JPG/PNG 형태의 사진을 올려주세요.
                </div>
              </div>
            </label>

            {previewUrl && (
              <div className="diag-preview">
                <img className="diag-preview-img" src={previewUrl} alt="preview" />
              </div>
            )}
          </div>

          <div className="diag-section">
            <div className="diag-section-title">Notes (optional)</div>
            <textarea
              className="diag-textarea"
              placeholder="추가 특징을 작성해주세요."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          <button className="diag-btn" type="submit" disabled={!file}>
            진단하기!
          </button>

          <div className="diag-result">
            <div className="diag-result-title">Result (placeholder)</div>
            <div className="diag-result-body">
              - 상태: <span className="muted">—</span>
              <br />
              - 확률: <span className="muted">—</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
