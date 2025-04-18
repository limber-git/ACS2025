const XSLX = require('xlsx');
const { Record } = require('../dbContext');
const dayjs = require('dayjs');
const Sequelize = require('sequelize');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

module.exports = {
    upLoadFile: async (file) => {
        try {
            const workbook = XSLX.read(file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const rows = XSLX.utils.sheet_to_json(worksheet);
            const excelData = rows.map(row => ({
                name: row.Name,
                date: parseDate(row.Date),
                timeTable: row.Timetable,
                onDuty: parseTime(row['On duty']),
                offDuty: parseTime(row['Off duty']),
                clockIn: parseTime(row['Clock In']),
                clockOut: parseTime(row['Clock Out']),
                late: parseTime(row.Late),
                early: parseTime(row.Early),
                exception: row.Exception, //string
                workTime: parseTime(row['Work Time']),
                department: row.Department,
                userId: row['AC-No.'],
                mustCIn: row['Must C/In'],
                mustCOut: row['Must C/Out'],
            }));

            const existingRecords = await Record.findAll({
                where: {
                    [Sequelize.Op.or]: excelData.map(data => ({
                        name: data.name,
                        date: data.date,
                        timeTable: data.timeTable,
                        onDuty: data.onDuty,
                        offDuty: data.offDuty,
                        clockIn: data.clockIn,
                        clockOut: data.clockOut,
                        workTime: data.workTime,
                        userId: data.userId,
                        mustCIn: data.mustCIn,
                        mustCOut: data.mustCOut,
                        late: data.late,
                        early: data.early,
                        exception: data.exception,
                        department: data.department,
                    })),
                },
            });

            const existingRecordsMap = new Map(existingRecords.map(record => [
                `${record.name}_${dayjs(record.date).format('DD/MM/YYYY')}_${record.timeTable}_${parseTime(record.onDuty)}_${parseTime(record.offDuty)}_${parseTime(record.clockIn)}_${parseTime(record.clockOut)}_${parseTime(record.workTime)}_${record.userId}_${record.mustCIn}_${record.mustCOut}_${record.late}_${record.early}_${record.exception}_${record.department}`,
                record
            ]));

            const newRecords = excelData.filter(data => {
                const key = `${data.name}_${dayjs(data.date).format('DD/MM/YYYY')}_${data.timeTable}_${data.onDuty}_${data.offDuty}_${data.clockIn}_${data.clockOut}_${data.workTime}_${data.userId}_${data.mustCIn}_${data.mustCOut}_${data.late}_${data.early}_${data.exception}_${data.department}`;
                return !existingRecordsMap.has(key);
            });

            if (newRecords.length > 0) {
                await Record.bulkCreate(newRecords);
                return true;
            } else {
                console.log('todos los datos están registrados en la base de datos');
                return false;
            }
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}

const parseTime = (time) => {
    if (!time) return null;
    const [hours, minutes] = time.split(':');
    if (hours && minutes) {
        return `${hours}:${minutes}`;
    }
    return null;
};

const parseDate = (date) => {
    if (!date) return null;
    const [day, month, year] = date.split('/');
    if (!day || !month || !year) return null;

    const parsedDate = dayjs.tz(`${year}-${month}-${day}`, 'YYYY-MM-DD', 'America/La_Paz');
    if (!parsedDate.isValid()) {
        return null;
    }

    return parsedDate.toISOString();
};
