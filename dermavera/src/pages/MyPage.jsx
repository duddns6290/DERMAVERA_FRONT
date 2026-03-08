import { useState } from "react";
import "./MyPage.css";

export default function MyPage() {
  const userName = "다희";

  const [pets, setPets] = useState([
    { id: 1, name: "콩이", type: "Dog" },
    { id: 2, name: "나비", type: "Cat" },
  ]);

  const [diagnoses, setDiagnoses] = useState([
    { id: 1, petName: "콩이", date: "2024-05-01", result: "정상" },
    { id: 2, petName: "나비", date: "2024-05-03", result: "피부염 의심" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newPetName, setNewPetName] = useState("");
  const [newPetType, setNewPetType] = useState("Dog");
  const [editingPetId, setEditingPetId] = useState(null);

  const [openDiagMenuId, setOpenDiagMenuId] = useState(null);

  const openAddModal = () => {
    setEditingPetId(null);
    setNewPetName("");
    setNewPetType("Dog");
    setShowModal(true);
  };

  const openEditModal = (pet) => {
    setEditingPetId(pet.id);
    setNewPetName(pet.name);
    setNewPetType(pet.type);
    setShowModal(true);
  };

  const handleSavePet = () => {
    if (!newPetName.trim()) return;

    if (editingPetId === null) {
      setPets([...pets, { id: Date.now(), name: newPetName, type: newPetType }]);
    } else {
      setPets(
        pets.map((pet) =>
          pet.id === editingPetId
            ? { ...pet, name: newPetName, type: newPetType }
            : pet
        )
      );
    }

    setShowModal(false);
    setEditingPetId(null);
  };

  const handleDeletePet = (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      setPets(pets.filter((pet) => pet.id !== id));
    }
  };

  const handleDeleteDiagnosis = (id) => {
    if (window.confirm("진단 이력을 삭제하시겠습니까?")) {
      setDiagnoses(diagnoses.filter((d) => d.id !== id));
      setOpenDiagMenuId(null);
    }
  };

  return (
    <div className="mypage-page">
      <div className="mypage-card">

        <div className="mypage-summary">
          <h1>안녕하세요, {userName}님</h1>
          <p>
            등록된 반려동물 {pets.length}마리 · 진단 기록 {diagnoses.length}건
          </p>
        </div>

        <section className="mypage-section">
          <div className="section-header">
            <h2>내 동물 정보</h2>
            <button className="add-btn" onClick={openAddModal}>
              + 동물 추가
            </button>
          </div>

          <ul className="pet-list">
            {pets.map((pet) => (
              <li key={pet.id} className="pet-item">
                <span>{pet.name} ({pet.type})</span>
                <div className="pet-actions">
                  <button onClick={() => openEditModal(pet)}>수정</button>
                  <button className="delete-btn" onClick={() => handleDeletePet(pet.id)}>
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mypage-section">
          <h2>진단 이력</h2>

          <ul className="diag-list">
            {diagnoses.map((d) => (
              <li key={d.id} className="diag-item">
                <div>
                  <strong>{d.petName}</strong> · {d.date}
                </div>

                <div className="diag-right">
                  <span className="diag-result">{d.result}</span>

                  <div className="diag-menu-wrapper">
                    <button
                      className="diag-menu-btn"
                      onClick={() =>
                        setOpenDiagMenuId(
                          openDiagMenuId === d.id ? null : d.id
                        )
                      }
                    >
                      ⋮
                    </button>

                    {openDiagMenuId === d.id && (
                      <div className="diag-menu">
                        <button onClick={() => handleDeleteDiagnosis(d.id)}>
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingPetId ? "동물 정보 수정" : "동물 추가"}</h3>

            <input
              value={newPetName}
              onChange={(e) => setNewPetName(e.target.value)}
              placeholder="이름"
            />

            <select
              value={newPetType}
              onChange={(e) => setNewPetType(e.target.value)}
            >
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
            </select>

            <div className="modal-actions">
              <button onClick={handleSavePet}>
                {editingPetId ? "수정" : "추가"}
              </button>
              <button className="cancel" onClick={() => setShowModal(false)}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

