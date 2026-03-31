"use client";

import React, { useMemo, useState } from "react";
import { useScheduledLecturesQuery } from "@/queries/lectures.queries";
import Error from "@/components/common/Error";
import Loading from "@/components/common/Loading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Video,
  ChevronLeft,
  ChevronRight,
  CalendarClock,
  BookOpen,
} from "lucide-react";

type SortOption = "date-asc" | "date-desc" | "status";

const ITEMS_PER_PAGE = 6;

const statusStyles: Record<string, string> = {
  STARTED: "bg-red-500 text-white border-black",
  NOT_STARTED: "bg-green-500 text-neutral-500 border-green-500",
  COMPLETED: "bg-neutral-900 text-neutral-300 border-neutral-700",
};

const statusLabel: Record<string, string> = {
  STARTED: "Live",
  NOT_STARTED: "Upcoming",
  COMPLETED: "Completed",
};

/* ─── Lecture Card ────────────────────────────────────────────────────────── */
const LectureCard = ({ lecture }: { lecture: any }) => {
  const startTime = new Date(lecture.startTime);
  const isLive = lecture.status === "STARTED";
  const isCompleted = lecture.status === "COMPLETED";
  const isUpcoming = lecture.status === "NOT_STARTED";

  return (
    <div className="group bg-white border border-black/8 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      {/* Top color strip — thin accent for live */}
      {isLive && <div className="h-0.5 bg-black w-full shrink-0" />}

      {/* Body */}
      <div className="p-4 flex flex-col gap-2.5 flex-1">
        {/* Course + Teacher */}
        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider truncate">
          {lecture.course.title} · {lecture.course.teacher.name}
        </p>

        {/* Title + Badge row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-green-400 leading-snug line-clamp-2 flex-1">
            {lecture.title}
          </h3>
          <span
            className={`shrink-0 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${statusStyles[lecture.status]}`}
          >
            {statusLabel[lecture.status]}
          </span>
        </div>

        {/* Date/time */}
        <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-black/5">
          <CalendarClock
            className="w-3.5 h-3.5 text-neutral-400 shrink-0"
            strokeWidth={1.8}
          />
          <span className="text-[11px] text-neutral-400 font-medium">
            {startTime.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            {" · "}
            {startTime.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        {isLive && (
          <Button
            className="w-full bg-black text-white hover:bg-black/80 rounded-xl text-xs h-8 gap-1.5"
            onClick={() => window.open(`/lecture/${lecture.id}`, "_blank")}
          >
            <Video className="w-3.5 h-3.5" />
            Join Live Session
          </Button>
        )}
        {isCompleted && (
          <Button
            variant="outline"
            className="w-full border-black/10 bg-white hover:bg-neutral-50 rounded-xl text-xs h-8 text-black"
            // onClick={() => window.open(`/lecture/${lecture.id}`, "_blank")}
          >
            Completed
          </Button>
        )}
        {isUpcoming && (
          <Button
            disabled
            className="w-full rounded-xl text-xs h-8 bg-neutral-100 text-neutral-400 cursor-not-allowed"
          >
            Starts Soon
          </Button>
        )}
      </div>
    </div>
  );
};

/* ─── Main Page ───────────────────────────────────────────────────────────── */
export default function LecturesPage() {
  const { isLoading, data, error } = useScheduledLecturesQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("date-desc");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "upcoming" | "completed" | "live"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);

  const lectures = useMemo(() => data?.lectures ?? [], [data]);

  const filteredLectures = useMemo(() => {
    let result = [...lectures];
    const now = new Date();

    if (searchQuery) {
      result = result.filter(
        (l: any) =>
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.course.teacher.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((l: any) => {
        if (statusFilter === "upcoming")
          return new Date(l.startTime) > now && l.status === "NOT_STARTED";
        if (statusFilter === "completed") return l.status === "COMPLETED";
        if (statusFilter === "live") return l.status === "STARTED";
        return true;
      });
    }

    return result;
  }, [lectures, searchQuery, statusFilter]);

  const sortedLectures = useMemo(() => {
    return [...filteredLectures].sort((a: any, b: any) => {
      if (sortOption === "date-asc")
        return (
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
      if (sortOption === "date-desc")
        return (
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
      if (sortOption === "status") return a.status.localeCompare(b.status);
      return 0;
    });
  }, [filteredLectures, sortOption]);

  const totalPages = Math.ceil(sortedLectures.length / ITEMS_PER_PAGE);
  const paginatedData = sortedLectures.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOption, statusFilter]);

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-2">
            Student Portal
          </p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-green-400">
                My Lectures
              </h1>
              <p className="text-sm text-neutral-400 font-medium mt-1">
                View and join your scheduled sessions
              </p>
            </div>
            <span className="text-xs text-neutral-400 font-medium shrink-0">
              <span className="text-black font-semibold">
                {sortedLectures.length}
              </span>{" "}
              {sortedLectures.length === 1 ? "lecture" : "lectures"}
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search lectures, courses, teachers..."
              className="pl-10 bg-white border-black/10 rounded-xl focus-visible:ring-black/20 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(v: any) => setStatusFilter(v)}
          >
            <SelectTrigger className="w-36 bg-white border-black/10 rounded-xl text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortOption}
            onValueChange={(v: SortOption) => setSortOption(v)}
          >
            <SelectTrigger className="w-44 bg-white border-black/10 rounded-xl text-sm">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-asc">Date (Old → New)</SelectItem>
              <SelectItem value="date-desc">Date (New → Old)</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Empty state */}
        {paginatedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-56 border border-dashed border-black/15 rounded-2xl bg-white">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-black/8 flex items-center justify-center mb-3">
              <BookOpen
                className="w-5 h-5 text-neutral-300"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-sm font-medium text-neutral-400">
              No lectures found
            </p>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedData.map((lecture: any) => (
                <LectureCard key={lecture.id} lecture={lecture} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="rounded-xl border-black/10 bg-white w-8 h-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="text-xs text-neutral-400 font-medium px-2">
                  Page{" "}
                  <span className="text-black font-semibold">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="text-black font-semibold">{totalPages}</span>
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="rounded-xl border-black/10 bg-white w-8 h-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
