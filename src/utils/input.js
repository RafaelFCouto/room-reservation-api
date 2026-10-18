function invalid(message) {
  return Object.assign(new Error(message), { status: 400 });
}

function positiveId(value) {
  if ((typeof value !== 'number' && typeof value !== 'string') ||
      !/^[1-9]\d*$/.test(String(value)) || !Number.isSafeInteger(Number(value))) {
    throw invalid('ID must be a positive integer');
  }
  return Number(value);
}

function objectBody(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw invalid('Request body must be an object');
  }
  return value;
}

function timeRange(startTime, endTime, optional = false) {
  if (optional && startTime === undefined && endTime === undefined) return null;
  const timestamp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;
  if (typeof startTime !== 'string' || typeof endTime !== 'string' ||
      !timestamp.test(startTime) || !timestamp.test(endTime)) {
    throw invalid('start_time and end_time must be ISO timestamps with a timezone');
  }
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) {
    throw invalid('Invalid start_time or end_time');
  }
  if (start >= end) {
    throw Object.assign(new Error('end_time must be after start_time'), { status: 422 });
  }
  return { start, end };
}

module.exports = { positiveId, objectBody, timeRange, invalid };
