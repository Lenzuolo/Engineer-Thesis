export const options =
{
        chart: {
          type: 'line',
          animations:
          {
              enabled: true,
              animateGradually: {
                enabled: true,
                delay: 150
            },
              dynamicAnimation: {
                enabled: true,
                speed: 350
                },
          },
          toolbar:
          {
              show: false,
              tools:
              {
                download: false,
                selection: false,
                zoom: false,
                zoomin: false,
                zoomout: false,
                pan: false,
                reset: false | '<img src="/static/icons/reset.png" width="20">',
                customIcons: [],
              },
          },
          events:
          {
              markerClick: undefined,
          },
        },
        grid:
        {
            show: true,
            xaxis: {
                lines:{
                show:true,
                }
            },
            yaxis: {
                lines:{
                show:false,
                }
            }
        },
        stroke: {
          curve: 'stepline',
        },
        xaxis: {
            type: 'numeric',
            tickPlacement: 'between',
            labels: {
                show: false,
            },
            title:
            {
                text: 't',
            },
            axisBorder: {
                show: true,
                color: '#000000',
            },
            axisTicks: {
                show: false,
            }
        },
        yaxis: {
            show: true,
            max: 2,
            min: 0,
            forceNiceScale: true,
            tickAmount: 1,
            axisBorder: {
                show: true,
                color: '#000000',
            },
            labels: {
                show: false,
            },
        },
        tooltip: {
            shared: false,
            enabled: true,
            interesect: true,
            x: {
                show: false,
            },
            y:{
                title:{
                    formatter: undefined,
                }
            },
        }
}