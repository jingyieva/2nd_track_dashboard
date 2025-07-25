import { forwardRef } from 'react';
import { Bar } from 'react-chartjs-2';

export default {
    component: forwardRef((props, ref) => <Bar {...props} ref={ref} />),
    formatData: ({ datas, labels }, theme) => {
        let datasets = [];
        if (datas && datas.length > 0) {
            datasets = datas.map(({ data, label }, index) => ({
                data,
                label,
                backgroundColor: datas.length > 1 ? theme.themeColor[index] : theme.themeColor
            }))
            
        }

        return {
            datasets,
            labels,
        };
    },
    options: {
        maintainAspectRatio: false,
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
};
