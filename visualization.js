document.addEventListener('DOMContentLoaded', function() {
    const ordersData = JSON.parse(localStorage.getItem('orders')) || [];

    function groupOrdersByMonthAndYear(orders) {
        return orders.reduce((acc, order) => {
            const orderDate = new Date(order.orderDate);
            const monthYear = `${orderDate.toLocaleString('default', { month: 'long', year: 'numeric' })}`;
            if (!acc[monthYear]) {
                acc[monthYear] = 0;
            }
            acc[monthYear]++;
            return acc;
        }, {});
    }

    function prepareChartData() {
        const groupedOrders = groupOrdersByMonthAndYear(ordersData);
        
        // Sort months by chronological order
        const sortedMonths = Object.keys(groupedOrders).sort((a, b) => {
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateA - dateB;
        });

        // Assign colors to each month
        const colors = generateColors(sortedMonths.length);
        
        const labels = sortedMonths.map(monthYear => monthYear);
        const data = sortedMonths.map(monthYear => groupedOrders[monthYear]);
        const backgroundColors = sortedMonths.map((monthYear, index) => colors[index]);

        return { labels, data, backgroundColors };
    }

    function generateColors(count) {
        // Generate colors based on count of months
        const colors = [];
        for (let i = 0; i < count; i++) {
            colors.push(getColorByIndex(i));
        }
        return colors;
    }

    function getColorByIndex(index) {
        // Array of predefined colors
        const predefinedColors = [
            'rgba(75, 192, 192, 0.7)',    // Green
            'rgba(54, 162, 235, 0.7)',    // Blue
            'rgba(255, 206, 86, 0.7)',    // Yellow
            'rgba(153, 102, 255, 0.7)',   // Purple
            'rgba(255, 159, 64, 0.7)',    // Orange
            'rgba(255, 99, 132, 0.7)',    // Red
            'rgba(54, 162, 235, 0.7)',    // Blue
            'rgba(75, 192, 192, 0.7)',    // Green
            'rgba(255, 206, 86, 0.7)',    // Yellow
            'rgba(153, 102, 255, 0.7)',   // Purple
            'rgba(255, 159, 64, 0.7)',    // Orange
            'rgba(255, 99, 132, 0.7)'     // Red
        ];
        return predefinedColors[index % predefinedColors.length];
    }

    function renderChart() {
        const { labels, data, backgroundColors } = prepareChartData();

        const ctx = document.getElementById('orders-chart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Orders',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            const dataset = data.datasets[tooltipItem.datasetIndex];
                            const value = dataset.data[tooltipItem.index];
                            const label = data.labels[tooltipItem.index] || '';
                            return `${label}: ${value}`;
                        }
                    }
                },
                cutoutPercentage: 70 // Adjust the size of the inner circle (hole) in percent
            }
        });

        // Create legend dynamically
        createLegend(labels, backgroundColors);
    }

    function createLegend(labels, backgroundColors) {
        const legendContainer = document.createElement('div');
        legendContainer.classList.add('legend-container');

        labels.forEach((label, index) => {
            const legendItem = document.createElement('div');
            legendItem.classList.add('legend-item');
            legendItem.innerHTML = `<span class="legend-color" style="background-color: ${backgroundColors[index]}"></span>${label}`;
            legendContainer.appendChild(legendItem);
        });

        document.getElementById('chart-section').appendChild(legendContainer);
    }

    renderChart();
});
