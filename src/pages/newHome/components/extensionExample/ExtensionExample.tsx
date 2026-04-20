import { useCallback, useEffect, useState } from "react";
import "./extensionExample.scss";
import ExtensionExampleText from "./extensionExampleText/ExtensionExampleText";
import ExtensionExampleImage from "./extensionExampleImage/ExtensionExampleImage";
import type { ExtensionScenario } from "./extensionExample.types";
import bigUofUsearly from "/assets/icons/bigUofUsearly.svg";

const SCENARIO_ROTATION: ExtensionScenario[] = [
  "signalez",
  "félicitez",
  "suggérez",
];
const AUTO_ROTATION_DELAY_MS = 7000;

const ExtensionExample = () => {
  const [selectedScenario, setSelectedScenario] =
    useState<ExtensionScenario>("signalez");
  const [hasUserAction, setHasUserAction] = useState(false);

  const handleUserAction = useCallback(() => {
    setHasUserAction(true);
  }, []);

  useEffect(() => {
    if (hasUserAction) return;

    const intervalId = window.setInterval(() => {
      setSelectedScenario((currentScenario) => {
        const currentIndex = SCENARIO_ROTATION.indexOf(currentScenario);
        const nextIndex =
          currentIndex === -1
            ? 0
            : (currentIndex + 1) % SCENARIO_ROTATION.length;

        return SCENARIO_ROTATION[nextIndex];
      });
    }, AUTO_ROTATION_DELAY_MS);

    return () => window.clearInterval(intervalId);
  }, [hasUserAction]);

  return (
    <div
      className="extension-example-container"
      onPointerDownCapture={handleUserAction}
      onFocusCapture={handleUserAction}
      onKeyDownCapture={handleUserAction}
    >
      <ExtensionExampleText
        selected={selectedScenario}
        setSelected={setSelectedScenario}
      />
      <ExtensionExampleImage
        selected={selectedScenario}
        onSelect={setSelectedScenario}
        advanceMode="click"
      />
      <img className="img2" src={bigUofUsearly} alt="U of Usearly" />
    </div>
  );
};

export default ExtensionExample;
