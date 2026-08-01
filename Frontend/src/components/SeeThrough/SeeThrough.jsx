import { X } from "lucide-react";
import { useSeeThrough } from "../../context/SeeThroughContext";
import { useLocale } from "../../context/LocaleContext";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import ImagePanel from "./panels/ImagePanel";
import VideoPanel from "./panels/VideoPanel";
import ProfilePanel from "./panels/ProfilePanel";
import UniversityPanel from "./panels/UniversityPanel";
import ClubPanel from "./panels/ClubPanel";
import EventPanel from "./panels/EventPanel";
import OpportunityPanel from "./panels/OpportunityPanel";
import "./SeeThrough.css";

const panels = {
  image: ImagePanel,
  video: VideoPanel,
  profile: ProfilePanel,
  university: UniversityPanel,
  club: ClubPanel,
  event: EventPanel,
  opportunity: OpportunityPanel,
};

function SeeThrough() {
  const { open, vibe, panelType, closeSeeThrough } = useSeeThrough();
  const { t } = useLocale();
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!open || !vibe) return null;

  const Panel = panels[panelType] || ImagePanel;

  return (
    <div className={`see-through ${isMobile ? "see-through--mobile" : ""}`}>
      <div className="see-through__backdrop" onClick={closeSeeThrough} />
      <div className="see-through__panel">
        <button type="button" className="see-through__close" onClick={closeSeeThrough} aria-label={t("common.close")}>
          <X size={20} />
        </button>
        <Panel vibe={vibe} />
      </div>
    </div>
  );
}

export default SeeThrough;
