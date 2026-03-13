"use client";

import { useMyProfileQuery } from "@/queries/profile.queries";
import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import Error from "./Error";
import {
  MapPin,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Pencil,
  Check,
  X,
  FileText,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FileUploadCompact from "../compact-upload";
import { FileWithPreview } from "@/hooks/use-file-upload";
import { useProfile } from "@/hooks/useProfile";

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface ProfileData {
  id: string;
  userId: string;
  avatarUrl: string | null;
  bio: string | null;
  headline: string | null;
  website: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  location: string | null;
  user: { name: string; email: string; role: string };
}
interface ApiResponse {
  success: boolean;
  profile: ProfileData | null;
}
interface FormState {
  avatarUrl: string;
  headline: string;
  bio: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
}
const EMPTY_FORM: FormState = {
  avatarUrl: "",
  headline: "",
  bio: "",
  location: "",
  website: "",
  github: "",
  linkedin: "",
  twitter: "",
};

/* ─── Compact field ───────────────────────────────────────────────────────── */
const Field = ({
  label,
  icon: Icon,
  value,
  onChange,
  isEditing,
  placeholder,
  prefix,
}: {
  label: string;
  icon: React.ElementType;
  value: string;
  onChange: (v: string) => void;
  isEditing: boolean;
  placeholder?: string;
  prefix?: string;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
      <Icon className="w-2.5 h-2.5" strokeWidth={2} />
      {label}
    </label>
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-2.5 text-[10px] text-neutral-400 font-medium select-none z-10 whitespace-nowrap">
          {prefix}
        </span>
      )}
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={!isEditing}
        placeholder={isEditing ? placeholder : "—"}
        className={`
          h-8 rounded-lg border-black/10 text-xs transition-all duration-200
          ${prefix ? "pl-[4.5rem]" : ""}
          ${
            !isEditing
              ? "bg-neutral-50 text-neutral-600 cursor-default disabled:opacity-100"
              : "bg-white focus-visible:ring-violet-300 focus-visible:border-violet-400"
          }
          ${!value && !isEditing ? "text-neutral-300" : ""}
        `}
      />
    </div>
  </div>
);

/* ─── Main ────────────────────────────────────────────────────────────────── */
const Profile = () => {
  const { editProfile } = useProfile();
  const { data, error, isLoading } = useMyProfileQuery();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [images, setImages] = useState<FileWithPreview[]>([]);
  const [fileUploadKey, setFileUploadKey] = useState(0);

  const profile = (data as ApiResponse | undefined)?.profile;
  const user = profile?.user;

  useEffect(() => {
    if (profile) {
      setForm({
        avatarUrl: profile.avatarUrl ?? "",
        headline: profile.headline ?? "",
        bio: profile.bio ?? "",
        location: profile.location ?? "",
        website: profile.website ?? "",
        github: profile.github ?? "",
        linkedin: profile.linkedin ?? "",
        twitter: profile.twitter ?? "",
      });
    }
  }, [profile]);

  const set = (key: keyof FormState) => (v: string) =>
    setForm((p) => ({ ...p, [key]: v }));

  const handleSave = async () => {
    setIsSaving(true);
    const avatarFile = images[0] ?? null;
    await editProfile({ image: avatarFile, ...form });
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm(
      profile
        ? {
            avatarUrl: profile.avatarUrl ?? "",
            headline: profile.headline ?? "",
            bio: profile.bio ?? "",
            location: profile.location ?? "",
            website: profile.website ?? "",
            github: profile.github ?? "",
            linkedin: profile.linkedin ?? "",
            twitter: profile.twitter ?? "",
          }
        : EMPTY_FORM,
    );
    setImages([]);
    setFileUploadKey((k) => k + 1);
    setIsEditing(false);
  };

  const uploadedPreview = images[0]?.preview ?? null;
  const avatarSrc = uploadedPreview ?? (form.avatarUrl || null);
  const initials = user?.name
    ? user.name
        .trim()
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

  const roleBadge: Record<string, string> = {
    TEACHER: "bg-violet-100 text-violet-700 border-violet-200",
    STUDENT: "bg-sky-100 text-sky-700 border-sky-200",
    ADMIN: "bg-neutral-100 text-neutral-700 border-neutral-200",
  };

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="h-screen bg-neutral-50 flex flex-col overflow-hidden">
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 flex flex-col min-h-0">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div>
            <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-1">
              Account
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-violet-600">
              My Profile
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {isEditing && (
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-700 transition-colors px-3 py-2"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
            )}
            {isEditing ? (
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="h-9 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-violet-200 gap-2"
              >
                {isSaving ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Save Changes
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="h-9 gap-2 rounded-xl border-black/10 text-sm font-semibold hover:bg-neutral-100"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* ── 2-column body ── */}
        <div className="flex-1 grid grid-cols-5 gap-4 min-h-0">
          {/* LEFT col — avatar card (2/5) */}
          <div className="col-span-2 flex flex-col gap-4">
            {/* Identity card */}
            <div className="bg-white border border-black/8 rounded-2xl p-5 shadow-sm flex flex-col items-center text-center flex-1">
              {/* Avatar */}
              <div className="relative mb-4 mt-2">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={user?.name}
                    className="w-20 h-20 rounded-2xl object-cover border border-black/10"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-violet-500 flex items-center justify-center border border-violet-400">
                    <span className="text-2xl font-bold text-white">
                      {initials}
                    </span>
                  </div>
                )}
                {uploadedPreview && (
                  <span className="absolute -top-1.5 -right-1.5 text-[8px] font-bold uppercase tracking-wider bg-violet-600 text-white px-1.5 py-0.5 rounded-full border-2 border-white">
                    New
                  </span>
                )}
              </div>

              <h2 className="text-base font-bold text-neutral-900">
                {user?.name ?? "Your Name"}
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5 truncate w-full px-2">
                {user?.email ?? "—"}
              </p>

              {user?.role && (
                <span
                  className={`mt-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${roleBadge[user.role] ?? roleBadge.ADMIN}`}
                >
                  {user.role}
                </span>
              )}

              {form.headline && (
                <p className="text-[11px] text-neutral-500 font-medium mt-3 px-2 leading-relaxed">
                  {form.headline}
                </p>
              )}

              {form.location && (
                <div className="flex items-center gap-1 mt-2 text-[10px] text-neutral-400">
                  <MapPin className="w-2.5 h-2.5 shrink-0" strokeWidth={2} />
                  {form.location}
                </div>
              )}

              {/* Social icons row */}
              {(form.github ||
                form.linkedin ||
                form.twitter ||
                form.website) && (
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-black/5 w-full justify-center">
                  {form.website && (
                    <Globe
                      className="w-4 h-4 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                      strokeWidth={1.8}
                    />
                  )}
                  {form.github && (
                    <Github
                      className="w-4 h-4 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                      strokeWidth={1.8}
                    />
                  )}
                  {form.linkedin && (
                    <Linkedin
                      className="w-4 h-4 text-neutral-400 hover:text-violet-500 transition-colors cursor-pointer"
                      strokeWidth={1.8}
                    />
                  )}
                  {form.twitter && (
                    <Twitter
                      className="w-4 h-4 text-neutral-400 hover:text-sky-500 transition-colors cursor-pointer"
                      strokeWidth={1.8}
                    />
                  )}
                </div>
              )}

              {/* Upload — edit mode */}
              {isEditing && (
                <div className="mt-4 pt-4 border-t border-black/5 w-full text-left">
                  <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-2.5">
                    Profile Photo
                  </p>
                  <FileUploadCompact
                    key={fileUploadKey}
                    maxFiles={1}
                    accept="image/*"
                    onFilesChange={(files) => setImages(files)}
                  />
                  {uploadedPreview && (
                    <p className="text-[9px] text-violet-500 font-medium mt-2 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" />
                      New photo selected
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT col — fields (3/5) */}
          <div className="col-span-3 flex flex-col gap-4 overflow-y-auto min-h-0">
            {/* Basic info */}
            <div className="bg-white border border-black/8 rounded-2xl p-5 shadow-sm shrink-0">
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-3">
                Basic Info
              </p>
              <div className="flex flex-col gap-3">
                <Field
                  label="Headline"
                  icon={Briefcase}
                  value={form.headline}
                  onChange={set("headline")}
                  isEditing={isEditing}
                  placeholder="e.g. Full Stack Developer · DSA Mentor"
                />
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                    <FileText className="w-2.5 h-2.5" strokeWidth={2} />
                    Bio
                  </label>
                  <Textarea
                    value={form.bio}
                    onChange={(e) => set("bio")(e.target.value)}
                    disabled={!isEditing}
                    placeholder={
                      isEditing ? "Tell others a bit about yourself…" : "—"
                    }
                    rows={3}
                    className={`
                      rounded-lg border-black/10 text-xs resize-none transition-all duration-200
                      ${!isEditing ? "bg-neutral-50 text-neutral-600 cursor-default disabled:opacity-100" : "bg-white focus-visible:ring-violet-300 focus-visible:border-violet-400"}
                      ${!form.bio && !isEditing ? "text-neutral-300" : ""}
                    `}
                  />
                </div>
                <Field
                  label="Location"
                  icon={MapPin}
                  value={form.location}
                  onChange={set("location")}
                  isEditing={isEditing}
                  placeholder="e.g. Kozhikode, Kerala"
                />
              </div>
            </div>

            {/* Links */}
            <div className="bg-white border border-black/8 rounded-2xl p-5 shadow-sm shrink-0">
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-3">
                Links
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Website"
                  icon={Globe}
                  value={form.website}
                  onChange={set("website")}
                  isEditing={isEditing}
                  placeholder="yoursite.com"
                  prefix="https://"
                />
                <Field
                  label="GitHub"
                  icon={Github}
                  value={form.github}
                  onChange={set("github")}
                  isEditing={isEditing}
                  placeholder="username"
                  prefix="github.com/"
                />
                <Field
                  label="LinkedIn"
                  icon={Linkedin}
                  value={form.linkedin}
                  onChange={set("linkedin")}
                  isEditing={isEditing}
                  placeholder="username"
                  prefix="linkedin.com/"
                />
                <Field
                  label="Twitter / X"
                  icon={Twitter}
                  value={form.twitter}
                  onChange={set("twitter")}
                  isEditing={isEditing}
                  placeholder="username"
                  prefix="x.com/"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
