import flammes from "/assets/icons/flammes.svg";
import type { RightSidebarStatItem } from "./rightSidebarTypes";
import RightSidebarStats from "./RightSidebarStats";

interface Props {
  loading: boolean;
  stats: RightSidebarStatItem[];
}

const RightSidebarDefaultCard = ({ loading, stats }: Props) => {
  return (
    <div className="right-sidebar">
      <h3>
        Ça chauffe par ici !
        <img className="side-flamme" src={flammes} alt="flamme" />
      </h3>

      <p className="subtitle">
        Les sujets qui font réagir la communauté en ce moment.
      </p>

      {loading ? <p>Chargement...</p> : <RightSidebarStats items={stats} />}
    </div>
  );
};

export default RightSidebarDefaultCard;
