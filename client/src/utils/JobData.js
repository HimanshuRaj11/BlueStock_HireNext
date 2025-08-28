export const Job_Status = ["pending", "interview", "declined"];

export const Job_Type = ["full-time", "part-time", "internship", "contract"];

export const Job_Sort_By = ["newest", "oldest", "a-z", "z-a"];

export const VISIBILITY_STATUS = {
    UNDER_REVIEW: 1,
    ACCEPTED: 2,
    HOLD: 3,
    REJECTED: 4,
};

export const VISIBILITY_STATUS_LABELS = {
    1: "Under Review",
    2: "Approved",
    3: "On Hold",
    4: "Rejected",
};

export const VISIBILITY_STATUS_OPTIONS = [
    { value: 1, label: "Under Review" },
    { value: 2, label: "Approve" },
    { value: 3, label: "Put On Hold" },
    { value: 4, label: "Reject" },
];