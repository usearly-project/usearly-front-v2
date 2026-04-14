import { useState } from "react";
import "./SolutionItem.scss";
import { voteSolution } from "@src/services/feedbackService";
import Avatar from "../shared/Avatar";

type Props = {
  solution: any;
};

export default function SolutionItem({ solution }: Props) {
  const [upvotes, setUpvotes] = useState(solution.upvotes ?? 0);
  const [downvotes, setDownvotes] = useState(solution.downvotes ?? 0);
  const [userVote, setUserVote] = useState<number | null>(
    solution.userVote ?? null,
  );

  const handleVote = async (value: 1 | -1) => {
    try {
      let newVote = userVote;
      let newUp = upvotes;
      let newDown = downvotes;

      if (userVote === value) {
        // ❌ toggle OFF
        newVote = null;

        if (value === 1) newUp -= 1;
        if (value === -1) newDown -= 1;
      } else if (userVote === null) {
        // ➕ nouveau vote
        newVote = value;

        if (value === 1) newUp += 1;
        if (value === -1) newDown += 1;
      } else {
        // 🔄 switch vote
        newVote = value;

        if (value === 1) {
          newUp += 1;
          newDown -= 1;
        } else {
          newDown += 1;
          newUp -= 1;
        }
      }

      // sécurité
      newUp = Math.max(0, newUp);
      newDown = Math.max(0, newDown);

      setUserVote(newVote);
      setUpvotes(newUp);
      setDownvotes(newDown);

      await voteSolution(solution.id, value);
    } catch (error) {
      console.error("vote error", error);
    }
  };

  return (
    <div className="solution-item">
      <div className="solution-card">
        <p className="solution-message">{solution.message}</p>

        {solution.title && (
          <p className="solution-highlight">👉 {solution.title}</p>
        )}

        {solution.steps?.length > 0 && (
          <div className="solution-steps">
            <span>Étapes :</span>
            <ol>
              {solution.steps.map((step: string, i: number) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        <div className="solution-footer">
          <div className="author">
            <Avatar
              avatar={solution.author.avatar}
              pseudo={solution.author.pseudo}
              type="user"
              className="avatar"
              wrapperClassName="avatar-wrapper-override"
              sizeHW={30}
            />
            <span>{solution.author.pseudo}</span>
          </div>

          <div className="votes">
            <button
              className={`vote-btn ${userVote === 1 ? "active" : ""}`}
              onClick={() => handleVote(1)}
              aria-label="Voter pour cette solution"
            >
              👍 {upvotes}
            </button>

            <button
              className={`vote-btn ${userVote === -1 ? "active" : ""}`}
              onClick={() => handleVote(-1)}
              aria-label="Voter contre cette solution"
            >
              👎 {downvotes}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
