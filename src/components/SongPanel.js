import SongPlayer from "@/components/SongPlayer";
import SongComments from "@/components/SongComments";

const SongPanel = (props) => {
  const { songPanelOnClose } = props;

  return (
    <>
      <SongPlayer
        songPanelOnClose={songPanelOnClose}
        showComments={props.showComments}
        setShowComments={props.setShowComments}
        className={props.showComments ? "hidden" : ""}
      />
      <SongComments className={props.showComments ? "" : "hidden"} />
    </>
  );
};

export default SongPanel;
