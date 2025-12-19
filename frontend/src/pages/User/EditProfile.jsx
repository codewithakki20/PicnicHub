import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchMe } from "../../store/authSlice";
import userApi from "../../api/userApi";

import Input from "../../components/forms/Input";
import FileUpload from "../../components/forms/FileUpload";
import Spinner from "../../components/ui/Spinner";

import {
  User,
  FileText,
  Camera,
  Save,
  AlertCircle,
  CheckCircle2,
  Loader,
  Building2,
  GraduationCap,
} from "lucide-react";

/* ================= PAGE ================= */

export default function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxUser = useSelector((s) => s.auth.user);

  const [values, setValues] = useState({
    name: "",
    bio: "",
    college: "",
    branch: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /* ================= LOAD USER ================= */

  useEffect(() => {
    if (reduxUser) {
      setValues({
        name: reduxUser.name || "",
        bio: reduxUser.bio || "",
        college: reduxUser.college || "",
        branch: reduxUser.branch || "",
      });
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const data = await userApi.fetchMe();
        setValues({
          name: data.name || "",
          bio: data.bio || "",
          college: data.college || "",
          branch: data.branch || "",
        });
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/auth/login");
          return;
        }
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [reduxUser, navigate]);

  /* ================= AVATAR PREVIEW ================= */

  useEffect(() => {
    if (!avatar) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(avatar);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [avatar]);

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const payload = {
        name: values.name.trim(),
        bio: values.bio.trim(),
        college: values.college,
        branch: values.branch.trim(),
      };

      if (avatar) payload.avatarFile = avatar;

      await userApi.updateMe(payload);
      await dispatch(fetchMe());

      setSuccess("Profile updated ✨ Redirecting…");

      setTimeout(() => navigate("/profile"), 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to update profile. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <Spinner />
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="relative min-h-screen bg-[#FAFAF8] pt-28 pb-20 px-4">

      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-[360px] h-[360px] bg-emerald-100 blur-[140px] opacity-60" />
      <div className="pointer-events-none absolute top-48 right-0 w-[320px] h-[320px] bg-amber-100 blur-[140px] opacity-50" />

      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3">
          Edit Profile
        </h1>
        <p className="text-slate-600 text-lg">
          Shape how the world sees your PicnicHub story.
        </p>
      </div>

      {/* Card */}
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] shadow-xl p-8 md:p-12">

        {/* Alerts */}
        {error && (
          <Alert type="error" icon={AlertCircle}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert type="success" icon={CheckCircle2}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Identity */}
          <Field label="Full Name" icon={User}>
            <Input
              value={values.name}
              onChange={(e) =>
                setValues({ ...values, name: e.target.value })
              }
              placeholder="Your name"
              className="rounded-xl text-lg font-semibold"
            />
          </Field>

          <Field label="Bio" icon={FileText}>
            <Input
              value={values.bio}
              onChange={(e) =>
                setValues({ ...values, bio: e.target.value })
              }
              placeholder="Tell people who you are (shows on your profile)"
              className="rounded-xl"
            />
          </Field>

          {/* Education Group */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-6">
            <Field label="College" icon={Building2}>
              <select
                value={values.college}
                onChange={(e) =>
                  setValues({ ...values, college: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              >
                <option value="">Select your college</option>
                <option value="CMDians">CMDians</option>
                <option value="LCITians">LCITians</option>
              </select>
            </Field>

            <Field label="Branch / Course" icon={GraduationCap}>
              <Input
                value={values.branch}
                onChange={(e) =>
                  setValues({ ...values, branch: e.target.value })
                }
                placeholder="e.g. Computer Science, Mechanical"
                className="rounded-xl"
              />
            </Field>
          </div>

          {/* Avatar */}
          <Field label="Profile Picture" icon={Camera}>
            <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-400 transition">

              <FileUpload
                accept="image/*"
                value={avatar}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  if (!file.type.startsWith("image/")) {
                    setError("Please select a valid image");
                    return;
                  }

                  if (file.size > 5 * 1024 * 1024) {
                    setError("Image must be under 5MB");
                    return;
                  }

                  setAvatar(file);
                  setError("");
                }}
              />

              {preview && (
                <div className="mt-4 flex flex-col items-center gap-2">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-emerald-200"
                  />
                  <span className="text-xs text-slate-500">
                    Click above to change photo
                  </span>
                </div>
              )}
            </div>
          </Field>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl text-lg font-bold text-white
              bg-gradient-to-r from-emerald-600 to-emerald-700
              shadow-lg shadow-emerald-600/30
              hover:scale-[1.02] transition-all
              flex items-center justify-center gap-2
              disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {submitting ? (
              <Loader size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {submitting ? "Saving..." : "Save Changes"}
          </button>

        </form>
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        <span className="flex items-center gap-2">
          <Icon size={14} className="text-slate-400" />
          {label}
        </span>
      </label>
      {children}
    </div>
  );
}

function Alert({ children, type, icon: Icon }) {
  const styles =
    type === "error"
      ? "bg-rose-50 text-rose-600 border-rose-100"
      : "bg-emerald-50 text-emerald-700 border-emerald-100";

  return (
    <div className={`mb-6 flex items-center gap-3 p-4 rounded-xl border ${styles}`}>
      <Icon size={18} />
      <span className="font-medium">{children}</span>
    </div>
  );
}
