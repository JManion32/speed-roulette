// isRed and isBlack are helpers for getColorClass

const isRed = new Set([
    "1",
    "3",
    "5",
    "7",
    "9",
    "12",
    "14",
    "16",
    "18",
    "19",
    "21",
    "23",
    "25",
    "27",
    "30",
    "32",
    "34",
    "36",
]);

const isBlack = new Set([
    "2",
    "4",
    "6",
    "8",
    "10",
    "11",
    "13",
    "15",
    "17",
    "20",
    "22",
    "24",
    "26",
    "28",
    "29",
    "31",
    "33",
    "35",
]);

const getColorClass = (num: string) => {
    if (num === "0" || num === "00") return "bg-green text-white";
    if (isRed.has(num)) return "bg-red text-white";
    if (isBlack.has(num)) return "bg-black text-white";
    return "bg-gray-400"; // if input is unexpected
};

export { getColorClass };
