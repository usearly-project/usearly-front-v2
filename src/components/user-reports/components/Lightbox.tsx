import CloseButton from "@src/components/buttons/CloseButtons";

interface Props {
  image: string | null;
  onClose: () => void;
}

const Lightbox: React.FC<Props> = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div className="lightbox" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <CloseButton stateSetter={() => {}} stateValue={null} />
        <img src={image} alt="Aperçu capture" />
      </div>
    </div>
  );
};

export default Lightbox;
