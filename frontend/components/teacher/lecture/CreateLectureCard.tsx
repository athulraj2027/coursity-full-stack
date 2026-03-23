"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { Clock, Loader2, Video, CalendarDays, Type, Eye } from "lucide-react";
import { useCreateLecture } from "@/mutations/lecture.mutations";

const CreateLectureCard = ({
  courseId,
  setModal,
}: {
  courseId: string;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [formData, setFormData] = useState({ title: "", meetingId: "" });
  const [date, setDate] = useState<Date | undefined>(today);
  const [time, setTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { mutate: createLectureApi, isPending } = useCreateLecture();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.title.trim())
      return toast.error("Please enter a lecture title");
    if (!date) return toast.error("Please select a lecture date");
    if (!time.trim()) return toast.error("Please select a lecture time");

    const [hours, minutes] = time.split(":");
    const startTime = new Date(date);
    startTime.setHours(Number(hours), Number(minutes), 0, 0);

    if (startTime <= new Date())
      return toast.error("Lecture start time must be in the future");

    const startTimeUTC = new Date(startTime.toISOString());
    setIsSubmitting(true);
    try {
      createLectureApi(
        { title: formData.title.trim(), startTime: startTimeUTC, courseId },
        {
          onSuccess: () => {
            toast.success("Lecture created successfully");
            setModal(false);
            setFormData({ title: "", meetingId: "" });
            setDate(undefined);
            setTime("");
          },
        },
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to create lecture");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preview datetime
  const previewDateTime =
    date && time
      ? (() => {
          const d = new Date(date);
          const [h, m] = time.split(":");
          d.setHours(Number(h), Number(m), 0, 0);
          return d.toLocaleString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
        })()
      : null;

  return (
    <div className="w-full bg-white border border-black/8 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-black/6">
        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center shrink-0">
          <Video className="w-4 h-4 text-white" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase">
            Teacher Portal
          </p>
          <h2 className="text-sm font-bold text-black tracking-tight leading-none mt-0.5">
            Schedule New Lecture
          </h2>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="px-6 py-5 space-y-5">
        {/* Title */}
        <div className="space-y-1.5">
          <label
            htmlFor="title"
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600"
          >
            <Type className="w-3.5 h-3.5" strokeWidth={1.8} />
            Lecture Title
          </label>
          <Input
            id="title"
            name="title"
            placeholder="Introduction to Data Structures"
            value={formData.title}
            onChange={handleInputChange}
            className="rounded-xl border-black/10 bg-neutral-50 focus-visible:ring-black/20 text-sm placeholder:text-neutral-400"
          />
        </div>

        {/* Date */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600">
            <CalendarDays className="w-3.5 h-3.5" strokeWidth={1.8} />
            Lecture Date
            {date && (
              <span className="ml-auto text-[10px] font-bold text-black bg-neutral-100 border border-black/8 px-2 py-0.5 rounded-full">
                {date.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          </label>
          <div className="rounded-xl border border-black/10 bg-neutral-50 overflow-hidden">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                if (selectedDate) setDate(selectedDate);
              }}
              className="w-full"
              captionLayout="dropdown"
              disabled={(d) => d < today}
            />
          </div>
        </div>

        {/* Time */}
        <div className="space-y-1.5">
          <label
            htmlFor="time"
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600"
          >
            <Clock className="w-3.5 h-3.5" strokeWidth={1.8} />
            Lecture Time
          </label>
          <div className="relative">
            <Clock
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400"
              strokeWidth={1.8}
            />
            <Input
              id="time"
              name="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="pl-9 rounded-xl border-black/10 bg-neutral-50 focus-visible:ring-black/20 text-sm"
            />
          </div>
        </div>

        {/* Preview */}
        {previewDateTime && (
          <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-neutral-50 border border-black/8">
            <Eye
              className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5"
              strokeWidth={1.8}
            />
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">
                Preview
              </p>
              <p className="text-xs font-semibold text-black leading-snug">
                {formData.title || "Untitled Lecture"}
              </p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                {previewDateTime}
              </p>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || isPending}
          className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-black text-white text-sm font-semibold border border-black hover:bg-black/80 active:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
        >
          {isSubmitting || isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating…
            </>
          ) : (
            "Schedule Lecture"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateLectureCard;
