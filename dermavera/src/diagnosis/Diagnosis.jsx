import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Diagnosis.css";
import logo from "../assets/logo/logo.png";
import { getToken, getStoredUser, fetchMyAnimals, diagnoseSkin } from "../api/client";

const BODY_PARTS = [
  { value: "", label: "선택 안 함" },
  { value: "ear", label: "귀" },
  { value: "belly", label: "배" },
  { value: "paw", label: "발" },
  { value: "face", label: "얼굴" },
  { value: "back", label: "등" },
  { value: "tail", label: "꼬리" },
];

export default function Diagnosis() {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [animalsLoading, setAnimalsLoading] = useState(true);
  const [animalId, setAnimalId] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [topK, setTopK] = useState(3);
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState("");

  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const previewUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    const token = getToken();
    const user = getStoredUser();
    if (!token || !user?.userPk) {
      navigate("/login", { replace: true });
      return;
    }

    let cancelled = false;
    fetchMyAnimals(user.userPk)
      .then((list) => {
        if (!cancelled) {
          setAnimals(list);
          if (list.length > 0 && !animalId) setAnimalId(String(list[0].id));
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "반려동물 목록을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!cancelled) setAnimalsLoading(false);
      });
    return () => { cancelled = true; };
  }, [navigate]);

  useEffect(() => {
    if (animals.length > 0 && !animalId) setAnimalId(String(animals[0].id));
  }, [animals, animalId]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const user = getStoredUser();
    if (!user?.userPk || !animalId || !file) {
      setError("반려동물을 선택하고 피부 사진을 올려주세요.");
      return;
    }

    const selectedAnimal = animals.find((a) => String(a.id) === String(animalId));
    const animalType = selectedAnimal?.species || "dog";

    const formData = new FormData();
    formData.append("image", file);
    formData.append("animal_type", animalType);
    if (bodyPart) formData.append("body_part", bodyPart);
    formData.append("top_k", String(topK));

    setSubmitLoading(true);
    try {
      const data = await diagnoseSkin(user.userPk, Number(animalId), formData);
      setResult(data);
    } catch (err) {
      setError(err.message || "진단 요청에 실패했습니다.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (animalsLoading) {
    return (
      <div className="diag-page">
        <div className="diag-card">
          <p className="diag-loading">반려동물 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (animals.length === 0) {
    return (
      <div className="diag-page">
        <div className="diag-card">
          <h1 className="diag-title">Skin Diagnosis</h1>
          <p className="diag-subtitle">
            진단하려면 마이페이지에서 반려동물을 먼저 등록해주세요.
          </p>
          <button
            type="button"
            className="diag-btn"
            onClick={() => navigate("/mypage")}
          >
            마이페이지로 이동
          </button>
        </div>
      </div>
    );
  }

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
            <div className="diag-section-title">반려동물 선택</div>
            <select
              className="diag-select"
              value={animalId}
              onChange={(e) => setAnimalId(e.target.value)}
              required
            >
              {animals.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                  {a.species ? ` (${a.species})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="diag-section">
            <div className="diag-section-title">Photo (필수)</div>

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
            <div className="diag-section-title">부위 (body_part, 선택)</div>
            <select
              className="diag-select"
              value={bodyPart}
              onChange={(e) => setBodyPart(e.target.value)}
            >
              {BODY_PARTS.map((opt) => (
                <option key={opt.value || "none"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="diag-section">
            <div className="diag-section-title">상위 예측 개수 (top_k)</div>
            <select
              className="diag-select diag-select-narrow"
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}개</option>
              ))}
            </select>
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

          {error && (
            <div className="diag-error" role="alert">
              {error}
            </div>
          )}

          <button
            className="diag-btn"
            type="submit"
            disabled={!file || submitLoading}
          >
            {submitLoading ? "진단 중..." : "진단하기!"}
          </button>

          {result && (
            <div className="diag-result">
              <div className="diag-result-title">진단 결과</div>
              <div className="diag-result-body">
                <p><strong>상태 (topLabel):</strong> {result.topLabel}</p>
                <p><strong>확률 (score):</strong> {(result.score != null ? (result.score * 100).toFixed(1) : "—")}%</p>
                {result.processingMs != null && (
                  <p><strong>처리 시간:</strong> {result.processingMs} ms</p>
                )}
                {result.predictions && result.predictions.length > 0 && (
                  <>
                    <p className="diag-result-list-title">상위 예측 (predictions)</p>
                    <ul className="diag-result-list">
                      {result.predictions.map((p, i) => (
                        <li key={i}>
                          {p.label}: {(p.score != null ? (p.score * 100).toFixed(1) : "—")}%
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
