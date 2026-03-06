import type { Request, Response } from "express";
import ExcelJS from "exceljs";
import AttendanceService from "../../services/attendance.services.js";

const TeacherAttendanceController = {
  // attendance for one lecture
  getAttendance: async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    // add filter, sort in future
    const attendanceData = await AttendanceService.getAttendanceDataForTeacher(
      user.id,
      id as string,
    );
    return res.status(200).json({ success: true, attendanceData });
  },

  downloadAttendance: async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    console.log("building xlsx");

    const attendanceData = await AttendanceService.getAttendanceDataForTeacher(
      user.id,
      id as string,
    );

    console.log("attendance data : ", attendanceData);
    const { course, lectures, students } = attendanceData;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Attendance");

    //////////////////////////////////////////////////////
    // TITLE
    //////////////////////////////////////////////////////

    worksheet.mergeCells("A1", `${String.fromCharCode(67 + lectures.length)}1`);
    const titleCell = worksheet.getCell("A1");

    titleCell.value = `${course} - Attendance Report`;
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    //////////////////////////////////////////////////////
    // HEADER
    //////////////////////////////////////////////////////

    const columns: any[] = [
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
    ];

    lectures.forEach((lecture) => {
      columns.push({
        header: lecture.title,
        key: lecture.id,
        width: 18,
      });
    });

    columns.push({
      header: "Attendance %",
      key: "percentage",
      width: 15,
    });

    worksheet.columns = columns;

    const headerRow = worksheet.getRow(2);
    headerRow.values = columns.map((c) => c.header);

    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center" };

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D9E1F2" },
      };

      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    //////////////////////////////////////////////////////
    // DATA ROWS
    //////////////////////////////////////////////////////

    students.forEach((student) => {
      const rowData: any = {
        name: student.name,
        email: student.email,
      };

      let presentCount = 0;

      student.lectures.forEach((lecture) => {
        rowData[lecture.lectureId] = lecture.status;

        if (lecture.status === "PRESENT") presentCount++;
      });

      const percentage = Math.round((presentCount / lectures.length) * 100);

      rowData.percentage = `${percentage}%`;

      const row = worksheet.addRow(rowData);

      //////////////////////////////////////////////////////
      // COLOR CELLS
      //////////////////////////////////////////////////////

      student.lectures.forEach((lecture) => {
        const cell = row.getCell(lecture.lectureId);

        cell.alignment = { horizontal: "center" };

        if (lecture.status === "PRESENT") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "C6EFCE" },
          };
        }

        if (lecture.status === "ABSENT") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFC7CE" },
          };
        }

        if (lecture.status === "LATE") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFEB9C" },
          };
        }
      });

      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    //////////////////////////////////////////////////////
    // FREEZE HEADER
    //////////////////////////////////////////////////////

    worksheet.views = [
      {
        state: "frozen",
        ySplit: 2,
      },
    ];

    //////////////////////////////////////////////////////
    // AUTO FILTER
    //////////////////////////////////////////////////////

    worksheet.autoFilter = {
      from: "A2",
      to: `${String.fromCharCode(65 + columns.length - 1)}2`,
    };

    //////////////////////////////////////////////////////
    // DOWNLOAD
    //////////////////////////////////////////////////////

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${course}-attendance.xlsx"`,
    );

    await workbook.xlsx.write(res);

    res.end();
  },

  finalizeAttendanceForLecture: async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    await AttendanceService.finalizeAttendance(user.id, id as string);
    return res.status(200).json({ success: true });
  },
};

export default TeacherAttendanceController;
