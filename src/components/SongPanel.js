import SongPlayer from "@/components/SongPlayer";
import SongComments from "@/components/SongComments";

const SongPanel = (props) => {
  const { songPanelOnClose, showComments, setShowComments } = props;

  return (
    <>
      {!showComments && (
        <SongPlayer
          songPanelOnClose={songPanelOnClose}
          showComments={showComments}
          setShowComments={setShowComments}
        />
      )}

      {showComments && <SongComments />}
    </>
  );
};

export default SongPanel;
