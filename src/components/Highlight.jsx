// src/components/Highlight.jsx

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const HL = ({ text, term }) => {
    if (!term || !text) return <>{text}</>;
    const re = new RegExp(`(${esc(term)})`, 'ig');
    return String(text).split(re).map((p, i) =>
        i % 2 === 1 ? <mark key={i} className="rounded bg-yellow-200/60 px-0.5 dark:bg-yellow-300/30">{p}</mark> : p
    );
};

export default HL;