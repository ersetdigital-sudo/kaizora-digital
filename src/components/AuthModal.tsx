
import { useEffect, useState } from "react";
import { CONFIG, wait } from "@/lib/data";
import { Store } from "@/lib/store";
import Modal from "./Modal";
import { useUI } from "./UIProvider";

type Mode = "login" | "register";

function authField(
  id: string,
  label: string,
  type: string,
  extra: Record<string, string | undefined> = {},
) {
  return { id, label, type, extra };
}

export default function AuthModal({ mode, onClose }: { mode: Mode | null; onClose: () => void }) {
  const { toast } = useUI();
  const [current, setCurrent] = useState<Mode>("login");
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode) {
      setCurrent(mode);
      setValues({});
      setErrors({});
      setLoading(false);
    }
  }, [mode]);

  if (!mode) return null;

  const fields =
    current === "register"
      ? [
          authField("name", "Nama lengkap", "text", { autoComplete: "name", maxLength: "40" }),
          authField("phone", "Nomor HP", "tel", { autoComplete: "tel", inputMode: "tel", maxLength: "14", placeholder: "08123456789" }),
          authField("email", "Email", "email", { autoComplete: "email", inputMode: "email", placeholder: "nama@email.com" }),
          authField("password", "Kata sandi", "password", { autoComplete: "new-password", placeholder: "Minimal 8 karakter" }),
          authField("confirm", "Ulangi kata sandi", "password", { autoComplete: "new-password" }),
        ]
      : [
          authField("email", "Email", "email", { autoComplete: "email", inputMode: "email", placeholder: "nama@email.com" }),
          authField("password", "Kata sandi", "password", { autoComplete: "current-password", placeholder: "Minimal 8 karakter" }),
        ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (current === "register") {
      if ((values.name ?? "").trim().length < 2) errs.name = "Nama minimal 2 karakter.";
      if (!/^08\d{8,12}$/.test((values.phone ?? "").trim())) errs.phone = "Nomor HP diawali 08 dan 10–14 digit.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((values.email ?? "").trim())) errs.email = "Format email belum benar.";
    if ((values.password ?? "").length < 8) errs.password = "Kata sandi minimal 8 karakter.";
    else if (current === "register" && !(/[A-Za-z]/.test(values.password!) && /\d/.test(values.password!)))
      errs.password = "Gunakan kombinasi huruf dan angka.";
    if (current === "register" && values.confirm !== values.password) errs.confirm = "Kata sandi tidak sama.";
    setErrors(errs);
    return errs;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    const keys = Object.keys(errs);
    if (keys.length) {
      document.getElementById(`a-${keys[0]}`)?.focus();
      return;
    }
    setLoading(true);
    await wait(700);
    const rawName =
      current === "register"
        ? (values.name ?? "").trim()
        : (values.email ?? "").split("@")[0]!.replace(/[._-]+/g, " ");
    const name = rawName.replace(/\b\p{L}/gu, (c) => c.toUpperCase());
    Store.set(CONFIG.userKey, { name, email: (values.email ?? "").trim() });
    window.dispatchEvent(new Event("kaizora:user"));
    setLoading(false);
    onClose();
    toast({ msg: `Selamat datang, ${name}!`, type: "success" });
  };

  return (
    <Modal id="authModal" title={<h2 id="authTitle">{current === "login" ? "Masuk ke KAIZORA DIGITAL" : "Buat Akun Baru"}</h2>} onClose={onClose} size="sm" labeledBy="authTitle">
      <div className="tabs" role="tablist" aria-label="Pilih Masuk atau Daftar">
        <button className="tab" type="button" role="tab" data-auth-tab="login" aria-selected={current === "login"} onClick={() => { setCurrent("login"); setErrors({}); }}>Login</button>
        <button className="tab" type="button" role="tab" data-auth-tab="register" aria-selected={current === "register"} onClick={() => { setCurrent("register"); setErrors({}); }}>Daftar</button>
      </div>
      <div className="notice notice--info"><i className="fa-solid fa-circle-info" aria-hidden="true" /><span>Hanya nama Anda yang disimpan di browser; kata sandi tidak disimpan.</span></div>
      <form id="authForm" data-mode={current} noValidate onSubmit={submit}>
        {fields.map((f) => (
          <div className="field" key={f.id}>
            <label htmlFor={`a-${f.id}`}>{f.label}</label>
            <input
              className="input"
              id={`a-${f.id}`}
              name={f.id}
              type={f.type}
              autoComplete={f.extra.autoComplete}
              inputMode={f.extra.inputMode as React.HTMLAttributes<HTMLInputElement>["inputMode"]}
              maxLength={f.extra.maxLength ? Number(f.extra.maxLength) : undefined}
              placeholder={f.extra.placeholder}
              value={values[f.id] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
              aria-describedby={`a-${f.id}-err`}
              aria-invalid={errors[f.id] ? true : false}
            />
            <p className="field__error" id={`a-${f.id}-err`} role="alert">{errors[f.id] ?? ""}</p>
          </div>
        ))}
        <button className={`btn btn--primary btn--block btn--lg${loading ? " is-loading" : ""}`} type="submit" style={{ marginTop: 8 }} disabled={loading}>
          {current === "login" ? "Masuk" : "Daftar Sekarang"}
        </button>
      </form>
    </Modal>
  );
}
