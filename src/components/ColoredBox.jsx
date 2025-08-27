export default function ColoredBox({ color, track }) {
    return (
        <div className="text-center">
            {/* Only show title if track exists */}
            {track && <h2 className="text-2xl font-bold mb-2">{track.name}</h2>}

            <div
                style={{
                    width: "300px",
                    height: "300px",
                    margin: "0 auto 16px auto",
                    borderRadius: "8px",
                    overflow: "hidden",
                    backgroundColor: color, // red/green flash still works
                    transition: "background-color 0.3s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {/* Show album cover only if track exists */}
                {track && (
                    <img
                        src={track.album.images[0]?.url}
                        alt={track.name}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

        </div>
    );
}
