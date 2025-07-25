import { Pie } from 'react-chartjs-2';

export default {
    component: (props) => <Pie {...props} />,
    formatData: ({ datas, labels }, theme) => {
        let datasets = [];
        if (datas && datas.length > 0) {
            datasets = datas.map(({ data, label }, index) => ({
                data,
                label,
                backgroundColor: datas.length > 1 ? theme.themeColor[index] : theme.themeColor,
                borderWidth: 0
            }))
            
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
                formatter: (value) => value,
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const percent = ((context.raw
                                / context.dataset.data.reduce((partialSum, cur) => partialSum + cur, 0)) * 100);
                        return `${context.label} : ${context.formattedValue} (${Math.round(percent)}%)`;
                    },
                },
            },
        },
    },
    plugins: [
        // ChartDataLabels,
    ],
};
