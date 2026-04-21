import "./SquareRoundButton.scss";

const SquareRoundButton = ({
  text,
  classNames,
  onClick,
}: {
  text: string;
  classNames: string;
  onClick?: () => void;
}) => {
  return (
    <button
      type="button"
      className={`square-round-button ` + classNames}
      aria-label={text}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default SquareRoundButton;
