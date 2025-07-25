import { Line } from 'react-chartjs-2';

export default {
    component: (props) => <Line {...props} />,
    formatData: ({ datas, labels, isArea }, theme) => {
        let datasets = [];

        if (datas && datas.length > 0) {
            if (datas && datas.length > 0) {
                datasets = datas.map(({ data, label }, index) => ({
                    data,
                    label,
                    borderColor: theme.themeColor[index],
                    borderWidth: 1,
                    fill: false,
                }))   
            }
        }

        return {
            datasets,
            labels,
        };
    },

    options: {
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                formatter: (value, context) => value,
            },
        },
        scales: {
            x: {
                ticks: {
                    autoSkip: false,
                },
            },
            y: {
                ticks: {
                    autoSkip: false,
                    precision: 0,
                    beginAtZero: true,
                },
            },
        },
    },
    // plugins: [ChartDataLabels],
};
