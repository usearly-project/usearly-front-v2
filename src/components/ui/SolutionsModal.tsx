import { useEffect, useState } from "react";
import "./SolutionsModal.scss";
import SolutionItem from "./SolutionItem";
import { getSolutionsByReport } from "@src/services/feedbackService";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import lightBulbLight from "/assets/icons/lightBulbLight.svg";
import lightBulbNoLight from "/assets/icons/lightBulbNoLight.svg";

type Props = {
  reportId: string;
  onClose: () => void;
  onAddSolution?: () => void;
};

export default function SolutionsModal({
  reportId,
  onClose,
  onAddSolution,
}: Props) {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.classList.add("solutions-modal-open");

    return () => {
      document.body.classList.remove("solutions-modal-open");
    };
  }, []);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const data = await getSolutionsByReport(reportId);
        setSolutions(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, [reportId]);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="solutions-modal-overlay">
      <div className="solutions-modal">
        {/* HEADER */}
        <div className="header-solution">
          <div className="header-left">
            <span className="header-left-icon">
              <img width="45" height="45" src={lightBulbLight} alt="light" />
            </span>
            <h2>Solutions de la communauté</h2>
          </div>

          <button
            className="close-btn-icon"
            onClick={onClose}
            aria-label="Fermer la fenêtre des solutions"
          >
            <X size={18} />
          </button>
        </div>

        <p className="subtitle">
          Voici des solutions ou astuces proposées par les utilisateurs pour
          contourner ce problème.
          <br />
          Indiquez si elles vous ont été utiles.
        </p>

        {/* CONTENT */}
        {loading ? (
          <p>Chargement...</p>
        ) : solutions.length === 0 ? (
          <p>Aucune solution pour le moment</p>
        ) : (
          solutions.map((solution, index) => (
            <div key={solution.id} className="solution-wrapper">
              {/* HEADER ACCORDION */}
              <div
                className={`solution-header ${openIndex === index ? "solution-open" : ""}`}
                onClick={() => toggle(index)}
              >
                <span>Solution {index + 1}</span>

                {openIndex === index ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>

              {/* CONTENT */}
              {openIndex === index && (
                <div className="solution-body">
                  <SolutionItem solution={solution} />
                </div>
              )}
            </div>
          ))
        )}

        {/* FOOTER */}
        <button
          className="add-solution"
          onClick={onAddSolution}
          aria-label="Proposer une autre solution"
        >
          <img src={lightBulbNoLight} width="20" height="20" alt="light" />
          Proposer une autre solution
        </button>

        <button className="close-btn" onClick={onClose} aria-label="Fermer">
          Fermer
        </button>
      </div>
    </div>
  );
}
