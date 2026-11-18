
import { LEGAL } from "@/lib/data";
import Modal from "./Modal";
import type { InfoState } from "./UIProvider";

export default function InfoModal({ state, onClose }: { state: InfoState; onClose: () => void }) {
  if (!state) return null;

  if (state.kind === "social") {
    return (
      <Modal id="infoModal" title={<h2 id="infoTitle">{`${state.name} (placeholder)`}</h2>} onClose={onClose} size="sm" labeledBy="infoTitle">
        <div className="prose">
          <p>Akun resmi {state.name} belum tersedia. Tautan sosial media akan diisi saat platform diluncurkan.</p>
        </div>
      </Modal>
    );
  }

  if (state.kind === "confirm") {
    return (
      <Modal
        id="infoModal"
        title={<h2 id="infoTitle">{state.title}</h2>}
        onClose={onClose}
        size="sm"
        labeledBy="infoTitle"
        footer={
          <>
            <button className="btn btn--outline" type="button" onClick={onClose}>Batal</button>
            <button
              className="btn btn--primary"
              type="button"
              data-info-ok
              onClick={() => {
                const cb = state.onConfirm;
                onClose();
                cb();
              }}
            >
              {state.label}
            </button>
          </>
        }
      >
        <div className="prose"><p>{state.text}</p></div>
      </Modal>
    );
  }

  const d = LEGAL[state.key];
  if (!d) return null;

  return (
    <Modal id="infoModal" title={<h2 id="infoTitle">{d.title}</h2>} onClose={onClose} size="sm" labeledBy="infoTitle">
      <div className="prose">
        {d.body.map(([h, t], i) =>
          i === 0 ? (
            <div className="notice" key={h}>
              <i className="fa-solid fa-circle-info" aria-hidden="true" />
              <span><b>{h}.</b> {t}</span>
            </div>
          ) : (
            <div key={h}>
              <h3>{h}</h3>
              <p>{t}</p>
            </div>
          ),
        )}
      </div>
    </Modal>
  );
}
