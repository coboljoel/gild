import { LESSONS } from '../lib/coach';

export default function Learn({ lessonId, onToggle }) {
  return (
    <div>
      <h1 className="view-title">Learn</h1>
      <div className="lessons-intro">Six short lessons behind everything the Coach tells you.</div>
      <div className="lessons-grid">
        {LESSONS.map(l => {
          const open = lessonId === l.id;
          return (
            <div
              className="lesson-card"
              key={l.id}
              style={{ borderColor: open ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.07)' }}
            >
              <div className="lesson-head">
                <span className="lesson-tag">{l.tag}</span>
                <span className="lesson-min">{l.min} min read</span>
              </div>
              <div className="lesson-title">{l.title}</div>
              {open && <div className="lesson-body">{l.body}</div>}
              <button className="lesson-toggle" onClick={() => onToggle(l.id)}>{open ? 'Close' : 'Read lesson'}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
