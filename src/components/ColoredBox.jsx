// src/components/ColoredBox.jsx
export default function ColoredBox({ color }) {
    return (
        <div
            style={{
                width: "400px",
                height: "100px",
                backgroundColor: color,
                margin: "0 auto 16px auto",
                transition: "background-color 0.3s",
                borderRadius: "8px",
            }}
        ></div>
    );
}
