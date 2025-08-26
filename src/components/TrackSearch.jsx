// src/components/TrackSearch.jsx
export default function TrackSearch({ query, setQuery, results, handleGuess }) {
    return (
        <div className="my-4">
            <input
                type="text"
                value={query}
                placeholder="Search for song..."
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-2 mb-2 border rounded"
            />
            <div className="space-y-2">
                {results.map((track) => (
                    <button
                        key={track.id}
                        className="w-full text-left p-2 border rounded hover:bg-gray-100"
                        onClick={() => handleGuess(track)}
                    >
                        <strong>{track.name}</strong> by {track.artists.map((a) => a.name).join(", ")}
                    </button>
                ))}
            </div>
        </div>
    );
}
