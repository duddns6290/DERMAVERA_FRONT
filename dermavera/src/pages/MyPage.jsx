import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./MyPage.css";
import { getStoredUser, getToken, fetchMyAnimals, createAnimal, fetchDiagnoses, updateAnimal, deleteAnimal } from "../api/client";

function formatDiagnosisDate(createdDate) {
  if (!createdDate) return "—";
  const d = new Date(createdDate);
  if (isNaN(d.getTime())) return createdDate;
  return d.toISOString().slice(0, 10);
}

export default function MyPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [petsLoading, setPetsLoading] = useState(true);
  const [petsError, setPetsError] = useState(null);

  const [diagnoses, setDiagnoses] = useState([]);
  const [diagnosesLoading, setDiagnosesLoading] = useState(true);
  const [diagnosesError, setDiagnosesError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [newPetName, setNewPetName] = useState("");
  const [newPetSpecies, setNewPetSpecies] = useState("dog");
  const [newPetAge, setNewPetAge] = useState("");
  const [editingPetId, setEditingPetId] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [openDiagMenuId, setOpenDiagMenuId] = useState(null);
  const [detailDiagnosis, setDetailDiagnosis] = useState(null);

  useEffect(() => {
    if (!getToken()) {
      navigate("/login", { replace: true });
      return;
    }
    const u = getStoredUser();
    if (!u?.userPk) {
      navigate("/login", { replace: true });
      return;
    }
    setUser(u);

    let cancelled = false;
    fetchMyAnimals(u.userPk)
      .then((list) => {
        if (!cancelled) setPets(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        if (!cancelled) setPetsError(err.message || "반려동물 목록을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!cancelled) setPetsLoading(false);
      });
    fetchDiagnoses(u.userPk)
      .then((list) => {
        if (!cancelled) setDiagnoses(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        if (!cancelled) setDiagnosesError(err.message || "진단 이력을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!cancelled) setDiagnosesLoading(false);
      });
    return () => { cancelled = true; };
  }, [navigate]);

  const openAddModal = () => {
    setEditingPetId(null);
    setNewPetName("");
    setNewPetSpecies("dog");
    setNewPetAge("");
    setSaveError("");
    setShowModal(true);
  };

  const openEditModal = (pet) => {
    setEditingPetId(pet.id);
    setNewPetName(pet.name);
    setNewPetSpecies(pet.species === "cat" ? "cat" : "dog");
    setNewPetAge(pet.age != null ? String(pet.age) : "");
    setSaveError("");
    setShowModal(true);
  };

  const handleSavePet = async () => {
    if (!newPetName.trim()) return;
    if (!user?.userPk) return;

    setSaveError("");
    setSaveLoading(true);

    const body = {
      name: newPetName.trim(),
      species: newPetSpecies,
      ...(newPetAge.trim() !== "" && { age: Number(newPetAge) }),
    };

    try {
      if (editingPetId == null) {
        const created = await createAnimal(user.userPk, body);
        setPets((prev) => [...prev, created]);
      } else {
        const updated = await updateAnimal(user.userPk, editingPetId, body);

        setPets((prev) =>
          prev.map((pet) =>
            pet.id === editingPetId ? updated : pet
          )
        );
      }
      setShowModal(false);
      setEditingPetId(null);
    } catch (err) {
      setSaveError(err.message || "저장에 실패했습니다.");
    } finally {
      setSaveLoading(false);
    }
  };

const handleDeletePet = async (id) => {
  if (!window.confirm("정말 삭제하시겠습니까?")) return;

  try {
    console.log("삭제 요청 보냄"); 

    await deleteAnimal(user.userPk, id);

    setPets((prev) => prev.filter((pet) => pet.id !== id));
  } catch (err) {
    alert(err.message || "삭제 실패");
  }
};

  const openDetailDiagnosis = (d) => {
    setOpenDiagMenuId(null);
    setDetailDiagnosis(d);
  };

  const userName = user?.userName || user?.userId || "";

  if (!user) {
    return null;
  }

  return (
    <div className="mypage-page">
      <div className="mypage-card">

        <div className="mypage-summary">
          <h1>안녕하세요, {userName}님</h1>
          <p>
            등록된 반려동물 {pets.length}마리 · 진단 기록 {diagnoses.length}건
          </p>
          <Link to="/diagnosis" className="mypage-diagnosis-link">
            Start diagnosis →
          </Link>
        </div>

        <section className="mypage-section">
          <div className="section-header">
            <h2>내 동물 정보</h2>
            <button className="add-btn" onClick={openAddModal}>
              + 동물 추가
            </button>
          </div>

          {petsError && <p className="mypage-error" role="alert">{petsError}</p>}
          {petsLoading ? (
            <p className="mypage-loading">불러오는 중...</p>
          ) : (
            <ul className="pet-list">
              {pets.map((pet) => (
                <li key={pet.id} className="pet-item">
                  <span>
                    {pet.name}
                    {pet.species ? ` (${pet.species})` : ""}
                    {pet.age != null ? ` · ${pet.age}살` : ""}
                  </span>
                  <div className="pet-actions">
                    <button onClick={() => openEditModal(pet)}>수정</button>
                    <button className="delete-btn" onClick={() => handleDeletePet(pet.id)}>
                      삭제
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mypage-section">
          <h2>진단 이력</h2>

          {diagnosesError && <p className="mypage-error" role="alert">{diagnosesError}</p>}
          {diagnosesLoading ? (
            <p className="mypage-loading">불러오는 중...</p>
          ) : diagnoses.length === 0 ? (
            <p className="mypage-loading">진단 이력이 없습니다.</p>
          ) : (
            <ul className="diag-list">
              {diagnoses.map((d) => (
                <li key={d.diagnosisId} className="diag-item">
                  <div>
                    <strong>{d.animalName}</strong> · {formatDiagnosisDate(d.createdDate)}
                  </div>

                  <div className="diag-right">
                    <span className="diag-result">{d.topLabel}</span>

                    <div className="diag-menu-wrapper">
                      <button
                        className="diag-menu-btn"
                        onClick={() =>
                          setOpenDiagMenuId(
                            openDiagMenuId === d.diagnosisId ? null : d.diagnosisId
                          )
                        }
                      >
                        ⋮
                      </button>

                      {openDiagMenuId === d.diagnosisId && (
                        <div className="diag-menu">
                          <button onClick={() => openDetailDiagnosis(d)}>
                            상세 보기
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingPetId ? "동물 정보 수정" : "동물 추가"}</h3>

            <input
              type="text"
              name="petName"
              autoComplete="off"
              value={newPetName}
              onChange={(e) => setNewPetName(e.target.value)}
              placeholder="이름"
              autoFocus
            />

            <select
              value={newPetSpecies}
              onChange={(e) => setNewPetSpecies(e.target.value)}
            >
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
            </select>

            <input
              type="number"
              min="0"
              value={newPetAge}
              onChange={(e) => setNewPetAge(e.target.value)}
              placeholder="나이 (선택)"
            />

            {saveError && <p className="mypage-modal-error" role="alert">{saveError}</p>}

            <div className="modal-actions">
              <button onClick={handleSavePet} disabled={saveLoading || !newPetName.trim()}>
                {saveLoading ? "저장 중..." : editingPetId ? "수정" : "추가"}
              </button>
              <button className="cancel" onClick={() => setShowModal(false)} disabled={saveLoading}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {detailDiagnosis && (
        <div className="modal-overlay" onClick={() => setDetailDiagnosis(null)}>
          <div className="modal modal-detail" onClick={(e) => e.stopPropagation()}>
            <h3>진단 상세</h3>
            <p><strong>{detailDiagnosis.animalName}</strong> · {formatDiagnosisDate(detailDiagnosis.createdDate)}</p>
            <p><strong>결과:</strong> {detailDiagnosis.topLabel}</p>
            {detailDiagnosis.score != null && (
              <p><strong>확률:</strong> {(detailDiagnosis.score * 100).toFixed(1)}%</p>
            )}
            {detailDiagnosis.predictions && detailDiagnosis.predictions.length > 0 && (
              <>
                <p className="mypage-detail-label">상위 예측</p>
                <ul className="mypage-detail-list">
                  {detailDiagnosis.predictions.map((p, i) => (
                    <li key={i}>{p.label}: {(p.score != null ? (p.score * 100).toFixed(1) : "—")}%</li>
                  ))}
                </ul>
              </>
            )}
            {detailDiagnosis.imageFilename && (
              <p className="mypage-detail-filename"><strong>이미지:</strong> {detailDiagnosis.imageFilename}</p>
            )}
            <div className="modal-actions">
              <button className="cancel" onClick={() => setDetailDiagnosis(null)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
