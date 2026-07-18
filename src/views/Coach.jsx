import { LESSONS } from '../lib/coach';

const GREEN = '#2FC97C', GOLD = '#D4AF37', WARN = '#E8B04C';

export default function Coach({ tips, onGoLesson }) {
  return (
    <div>
      <h1 className="view-title">Coach</h1>
      <div className="coach-disclaimer">
        Gild teaches investing concepts by reacting to <em>your</em> portfolio. It never recommends buying or
        selling specific securities. Educational only — not financial advice.
      </div>
      <div className="tip-list">
        {tips.map((tip, i) => {
          const dotColor = tip.tone === 'warn' ? WARN : tip.tone === 'good' ? GREEN : GOLD;
          const lesson = LESSONS.find(l => l.id === tip.lesson);
          return (
            <div className="card" key={i}>
              <div className="tip-tag-row">
                <span className="tip-dot" style={{ background: dotColor }} />
                <span className="tip-tag" style={{ color: dotColor }}>{tip.tag}</span>
              </div>
              <div className="tip-title">{tip.title}</div>
              <div className="tip-body">{tip.body}</div>
              <div className="tip-actions">
                <button className="btn-ghost" onClick={() => onGoLesson(tip.lesson)}>Lesson: {lesson.title}</button>
                <span className="tip-note">Not financial advice</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
