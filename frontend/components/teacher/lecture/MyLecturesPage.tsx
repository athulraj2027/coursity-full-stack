"use client";

import React, { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { DataTable } from "@/components/common/Table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Loading from "@/components/common/Loading";
import Error from "@/components/common/Error";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useMyLecturesQuery } from "@/queries/lectures.queries";
import LectureActions from "./LectureActions";
import { LECTURES_PAGE_POINTS } from "@/constants/teacher";

type LectureTableRow = {
  id: string;
  title: string;
  courseTitle: string;
  status: "NOT_STARTED" | "STARTED" | "COMPLETED";
  startTime: string;
  createdAt: string;
  rawStartTime: Date;
  rawCreatedAt: Date;
};

type SortOption = {
  field: "title" | "startTime" | "createdAt";
  direction: "asc" | "desc";
};

const statusStyles: Record<string, string> = {
  NOT_STARTED: "bg-slate-100 text-slate-700 border-slate-200",
  STARTED: "bg-emerald-600 text-white border-emerald-600",
  COMPLETED: "bg-indigo-600 text-white border-indigo-600",
};

const MyLecturesPage = () => {
  const { data, isLoading, error } = useMyLecturesQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "NOT_STARTED" | "STARTED" | "COMPLETED"
  >("all");
  const [sortOption, setSortOption] = useState<SortOption>({
    field: "createdAt",
    direction: "desc",
  });

  const tableData: LectureTableRow[] = useMemo(() => {
    if (!data) return [];
    return data.map((lecture: any) => ({
      id: lecture.id,
      title: lecture.title,
      courseTitle: lecture.course.title,
      status: lecture.status,
      startTime: new Date(lecture.startTime).toLocaleString("en-IN", {
  timeZone: "Asia/Kolkata",
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
}),
      createdAt: new Date(lecture.createdAt).toLocaleDateString(),
      rawStartTime: new Date(lecture.startTime),
      rawCreatedAt: new Date(lecture.createdAt),
    }));
  }, [data]);

  const processedData = useMemo(() => {
    let filtered = [...tableData];

    if (searchQuery) {
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((l) => l.status === statusFilter);
    }

    filtered.sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;
      switch (sortOption.field) {
        case "title":
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case "startTime":
          aVal = a.rawStartTime.getTime();
          bVal = b.rawStartTime.getTime();
          break;
        case "createdAt":
          aVal = a.rawCreatedAt.getTime();
          bVal = b.rawCreatedAt.getTime();
          break;
        default:
          return 0;
      }
      if (aVal < bVal) return sortOption.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOption.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [tableData, searchQuery, statusFilter, sortOption]);

  const hasActiveFilters = searchQuery !== "" || statusFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  const columns: ColumnDef<LectureTableRow>[] = [
    {
      header: "SI.No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "title",
      header: "Lecture",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-black">{row.original.title}</p>
          <p className="text-xs text-neutral-400 mt-0.5">
            {row.original.courseTitle}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "startTime",
      header: "Start Time",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => (
        <span
          className={`inline-block text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${statusStyles[getValue<string>()]}`}
        >
          {getValue<string>().replace("_", " ")}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <LectureActions
          lectureId={row.original.id}
          startingTime={row.original.rawStartTime}
          status={row.original.status}
        />
      ),
    },
  ];

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-2">
            Teacher Portal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-blue-500">
            My Lectures
          </h1>
          <p className="text-sm text-neutral-400 font-medium mt-1">
            Manage and monitor all your scheduled sessions
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {/* Search */}
          <div className="relative flex-1 min-w-62.5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search lectures or courses..."
              className="pl-10 bg-white border-black/10 rounded-xl focus-visible:ring-black/20 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Sort */}
          <Select
            value={`${sortOption.field}-${sortOption.direction}`}
            onValueChange={(v) => {
              const [field, direction] = v.split("-") as [
                SortOption["field"],
                SortOption["direction"],
              ];
              setSortOption({ field, direction });
            }}
          >
            <SelectTrigger className="w-44 bg-white border-black/10 rounded-xl text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Newest First</SelectItem>
              <SelectItem value="createdAt-asc">Oldest First</SelectItem>
              <SelectItem value="startTime-asc">Start Time ↑</SelectItem>
              <SelectItem value="startTime-desc">Start Time ↓</SelectItem>
              <SelectItem value="title-asc">Title A–Z</SelectItem>
              <SelectItem value="title-desc">Title Z–A</SelectItem>
            </SelectContent>
          </Select>

          {/* Filters Popover */}
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 bg-white border-black/10 rounded-xl text-sm hover:bg-neutral-50"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge className="ml-1 px-1.5 min-w-5 h-5 bg-black text-white text-[10px] rounded-full">
                    {[
                      searchQuery ? 1 : 0,
                      statusFilter !== "all" ? 1 : 0,
                    ].reduce((a, b) => a + b, 0)}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-64 rounded-2xl border-black/10 shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-black">Filters</p>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-auto p-0 text-xs text-neutral-400 hover:text-black"
                    >
                      Clear all
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Status
                  </p>
                  <Select
                    value={statusFilter}
                    onValueChange={(v: any) => setStatusFilter(v)}
                  >
                    <SelectTrigger className="rounded-xl border-black/10 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                      <SelectItem value="STARTED">Live</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Clear */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-2 text-neutral-400 hover:text-black rounded-xl"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        {/* Results count */}
        <p className="text-xs text-neutral-400 font-medium mb-4">
          Showing{" "}
          <span className="text-black font-semibold">
            {processedData.length}
          </span>{" "}
          of{" "}
          <span className="text-black font-semibold">{tableData.length}</span>{" "}
          lectures
        </p>

        {LECTURES_PAGE_POINTS.map((point, i) => (
          <div key={i} className="flex items-start gap-1">
            <span className="text-red-600 text-sm">*</span>
            <p className="text-xs text-neutral-400 font-medium">{point}</p>
          </div>
        ))}

        {/* Table */}

        <div className="bg-white border border-black/8 rounded-2xl overflow-hidden shadow-sm">
          <DataTable columns={columns} data={processedData} />
        </div>
      </div>
    </div>
  );
};

export default MyLecturesPage;
