import { delayRender, continueRender } from "remotion";
import { fontsLoaded } from "./trs/fichly";
import { Cadre04Composition } from "./trs/Cadre04";
import { Panneau04Composition } from "./trs/Panneau04";
import { Temoin1Composition } from "./trs/Temoin1";

// Les polices Poppins locales doivent être chargées avant le rendu de la première image
const handle = delayRender("Chargement des polices Poppins");
fontsLoaded.then(() => continueRender(handle));

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Cadre04Composition />
      <Panneau04Composition />
      <Temoin1Composition />
    </>
  );
};
