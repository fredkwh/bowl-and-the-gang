import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
// <-- Ajuste ici le chemin vers ton fichier de config Firebase !
import { db } from "../firebase/firebaseconfig";

export default function MonCompte() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("infos");
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) return; 
    setUser(currentUser);
    fetchUserData(currentUser.uid);
  }, []);

  const fetchUserData = async (uid) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      setDisplayName(data.displayName || "");
      setPhoneNumber(data.phoneNumber || "");
    }
  };

  const handleUpdate = async () => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      displayName,
      phoneNumber,
    });
    setEditMode(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-sable-chaud flex items-center justify-center">
        <p className="text-gray-700">Veuillez vous connecter pour voir votre compte.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sable-chaud p-4 flex flex-col sm:flex-row">
      {/* Sidebar */}
      <div className="sm:w-1/4 mb-4 sm:mb-0 sm:mr-4">
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => setActiveTab("infos")}
            className={`w-full px-3 py-2 rounded hover:bg-sable-chaud/70 text-left ${
              activeTab === "infos" ? "bg-sable-chaud font-semibold" : ""
            }`}
          >
            🧍 Mes informations
          </button>
          <button
            onClick={() => setActiveTab("commandes")}
            className={`w-full px-3 py-2 rounded hover:bg-sable-chaud/70 text-left ${
              activeTab === "commandes" ? "bg-sable-chaud font-semibold" : ""
            }`}
          >
            📦 Mes commandes
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div className="sm:w-3/4 bg-blanc-coco rounded shadow p-6">
        {activeTab === "infos" && (
          <>
            <h1 className="text-2xl font-bold mb-4">Mon compte</h1>
            <p className="mb-2"><strong>Email :</strong> {user.email}</p>
            <p className="mb-2"><strong>ID utilisateur :</strong> {user.uid}</p>

            {!editMode ? (
              <>
                <p className="mb-2"><strong>Nom affiché :</strong> {displayName || "(non défini)"}</p>
                <p className="mb-4"><strong>Téléphone :</strong> {phoneNumber || "(non défini)"}</p>
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-ocre-dore text-white rounded hover:bg-ocre-dore/90"
                >
                  Modifier
                </button>
              </>
            ) : (
              <>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Nom affiché :</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Téléphone :</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-ocre-dore text-white rounded hover:bg-ocre-dore/90 mr-2"
                >
                  Sauvegarder
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-noir-cacao-doux text-white rounded hover:bg-noir-cacao-doux/90"
                >
                  Annuler
                </button>
              </>
            )}
          </>
        )}

        {activeTab === "commandes" && (
          <>
            <h1 className="text-2xl font-bold mb-4">Mes commandes</h1>
            <p>Aucune commande trouvée.</p>
          </>
        )}
      </div>
    </div>
  );
}
