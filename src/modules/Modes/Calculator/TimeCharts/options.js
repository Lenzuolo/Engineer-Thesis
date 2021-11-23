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
              show: true,
              tools:
              {
                download: false,
                selection: true,
                zoom: false,
                zoomin: false,
                zoomout: false,
                pan: false,
                reset: false | '<img src="/static/icons/reset.png" width="20">',
                customIcons: [],
              },
          },
          selection:
          {
              enabled: true,
          },
          events:
          {
              selection:
                function(chartContext, { xaxis, yaxis }) 
                {
                    console.log(chartContext,xaxis,yaxis);
                },
              markerClick:
                function(event, chartContext, { seriesIndex, dataPointIndex, config}) 
                {
                    console.log(event,chartContext,{ seriesIndex,dataPointIndex,config });
                },
          }

        },
        grid:
        {
            show: false,
        },
        stroke: {
          curve: 'stepline',
        },
        xaxis: {
            tickAmount: 'dataPoints',
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