import "./SquareRoundButton.scss";

const SquareRoundButton = ({
  text,
  classNames,
}: {
  text: string;
  classNames: string;
}) => {
  return (
    <button className={`square-round-button ` + classNames} aria-label={text}>
      {text}
    </button>
  );
};

export default SquareRoundButton;
