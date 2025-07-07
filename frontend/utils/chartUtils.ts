let totalCount: number = 0;

export const createStackedBarData = (
    counts: Record<string, number>,
    customOrder?: string[],
) => {
    totalCount = Object.values(counts).reduce((sum, val) => sum + val, 0);
    const order = customOrder ?? Object.keys(counts);

    const colors: Record<string, string> = {
        red: "#dc2626",
        black: "#000000",
        green: "#008000",
        even: "#3b82f6",
        odd: "#d17614",
        high: "#8b5cf6",
        low: "#33b78c",
        first: "#069ab1",
        second: "#c1a038",
        third: "#f472b6",
        top: "#7c3aed",
        middle: "#f87171",
        bottom: "#0ca947",
        zero: "#14b8a6",
        neither: "#9ca3af",
    };

    let filledPercent = 0;

    const datasets = order.map((label) => {
        let percent: number;

        if (label === "neither") {
            // Temporarily set to 0, will update after loop
            percent = 0;
        } else {
            const count = counts[label] ?? 0;
            percent = totalCount === 0 ? 0 : (count / totalCount) * 100;
            filledPercent += percent;
        }

        return {
            label,
            data: [percent],
            backgroundColor: colors[label] || colors.neither,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            borderRadius:
                order.length === 1
                    ? 6
                    : label === order[0]
                      ? {
                            topLeft: 6,
                            bottomLeft: 6,
                            topRight: 0,
                            bottomRight: 0,
                        }
                      : label === order[order.length - 1]
                        ? {
                              topRight: 6,
                              bottomRight: 6,
                              topLeft: 0,
                              bottomLeft: 0,
                          }
                        : 0,
        };
    });

    // Now replace the 'none' placeholder with actual remainder %
    const remaining = 100 - filledPercent;
    for (const ds of datasets) {
        if (ds.label === "neither") {
            ds.data = [remaining > 0 ? remaining : 0];
        }
    }

    return {
        labels: [""],
        datasets,
    };
};

export const stackedBarOptions = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: { stacked: true, display: false, max: 100 },
        y: { stacked: true, display: false },
    },
    plugins: {
        legend: { display: false },
        tooltip: {
            callbacks: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                label: (ctx: any) =>
                    `${ctx.dataset.label}: ${ctx.raw.toFixed(1)}%`,
            },
        },
        datalabels: {
            color: "#ffffff",
            font: {
                weight: "bold" as const,
                size: 24,
                family: "'Inter', sans-serif",
            },
            anchor: "center" as const,
            align: "center" as const,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter: (_value: number, context: any) => {
                const label = context.dataset.label;
                if (label === "neither" && _value == 100) { return "No data available"};
                if (label === "neither" || label === "green") return "";
                if (_value !== 0) return label.toUpperCase();
                return null;
            },
            clip: true,
        },
    },
    elements: {
        bar: {
            borderSkipped: false,
        },
    },
};
