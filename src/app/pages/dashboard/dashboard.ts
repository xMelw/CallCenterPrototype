import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { ChartComponent } from "ng-apexcharts";
import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexFill,
  ApexStroke,
  ApexLegend,
  ApexTooltip,
  ApexResponsive,
  ApexAxisChartSeries,
  ApexDataLabels,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexStates
} from "ng-apexcharts";
import { FormsModule } from "@angular/forms";

export type VolumeCallsChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: ApexLegend;
  colors: string[];
};

export type TopCallReasonsChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  colors: string[];
  stroke: ApexStroke;
  fill: ApexFill;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
}


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgClass, ChartComponent, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ){
    this.volumeCallsChart = { // Configuração do gráfico (Volume de Chamadas)
      series: [
        {
          name: 'Incoming',
          data: [12, 18, 24, 29, 22, 34, 31]
        },
        {
          name: 'Answered',
          data: [10, 15, 21, 25, 19, 26, 28]
        },
        {
          name: 'Missed',
          data: [2, 3, 4, 4, 3, 8, 5]
        }
      ],
      chart: {
        type: 'area',
        height: 240,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        },
        sparkline: {
          enabled: false
        }
      },
      colors: ['#4F46E5', '#10B981', '#eF4444'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2.5,
        dashArray: [0, 0, 4]
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0.3,
          opacityFrom: 0.15,
          opacityTo: 0.01,
          stops: [0, 100]
        }
      },
      grid: {
        show: true,
        borderColor: '#F1F5F9',
        strokeDashArray: 5,
        position: 'back',
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        },
        padding: {
          top: 10,
          right: 20,
          bottom: 0,
          left: 10
        }
      },
      xaxis: {
        categories: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '15:00'],
        labels: {
          style: {
            colors: '#94A3B8',
            fontSize: '11px',
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        min: 0,
        max: 36,
        tickAmount: 4,
        labels: {
          style: {
            colors: '#94A3B8',
            fontSize: '11px'
          }
        }
      },
      tooltip: {
        shared: true,
        intersect: false,
        theme: 'light',
        style: {
          fontSize: '12px'
        },
        y: {
          formatter: (val) => `${val} calls`
        }
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
        offsetX: 0,
        offsetY: -20,
        fontSize: '12px',
        fontWeight: 500,
        labels: {
          colors: '#64748B'
        },
        markers: {
          size: 5,
          shape: 'circle',
          strokeWidth: 0,
          // radius: 12
        },
        itemMargin: {
          horizontal: 10,
          vertical: 0
        }
      }
    };

    this.topCallReasonsChart = { // Configuração do RadialChart (Call Reasons)
      series: this.callReasons.map(item => item.value),

      colors: this.callReasons.map(item => item.color),

      chart: {
        type: 'radialBar',
        height: 260,
        sparkline: {
          enabled: true
        },
        events: {
          dataPointMouseEnter: (_event, _chartContext, config) => {
            const index = config.seriesIndex;

            if ( this.callReasons[index]) {
              this.hoverReason(this.callReasons[index]);
            }
          },

          mouseLeave: () => {
            this.resetReason();
          }
        }
      },

      plotOptions: {
        radialBar: {

          startAngle: -110,

          endAngle: 225,

          hollow: {
            size: '65%'
          },

          track: {
            background: '#F4F6FA',
            strokeWidth: '100%',
            margin: 8
          },
          
          dataLabels: {
            show: false
          }
        }
      },

      stroke: {
        lineCap: 'round'
      },

      fill: {
        type: 'solid'
      },

      legend: {
        show: false
      },

      tooltip: {
        enabled: false
      },

      responsive: [
        {
          breakpoint: 1200,
          options: {
            chart: {
              height: 220
            }
          }
        }
      ]
    }
  
  }

  KPI = [
    {title: 'Incoming Calls', time: 'Last 7 days', number: '34', compare:'+5%'},
    {title: 'Answered Calls', time: 'Last 7 days', number: '26', compare:'+7%'},
    {title: 'Missed Calls', time: 'Last 7 days', number: '11', compare:'-2%'},
    {title: 'Online time', time: 'per day', onlineTime: '8.2'}
  ]

  callReasons = [
    {name: 'Technical Support', value: 76, color: '#4F8CFF'},
    {name: 'Billing Issues', value: 68, color: '#F97316'},
    {name: 'Order Traking', value: 57, color: '#8B5CF6'},
    {name: 'Returns & Refunds', value: 43, color: '#10B981'},
    {name: 'General Inquiry', value: 30, color: '#ef4444'}
  ]

  bestAgents = [
    {name: 'Diana Silva', role: 'Technical Support', calls: 142, rating: 4.9, avatar: 'DS', status: 'Optimal'},
    {name: 'Tiago Ribeiro', role: 'Billing Issues', calls: 128, rating: 4.8, avatar: 'TR', status: 'Optimal'},
    {name: 'Beatriz Costa', role: 'Technical Support', calls: 115, rating: 4.7, avatar: 'BC', status: 'Good'},
    {name: 'João Santos', role: 'General Inquiry', calls: 98, rating: 4.6, avatar: 'JS', status: 'Good'},
  ]

  realTimeLogs = [
    {time: '15:04', agent: 'Diana Silva', action: 'answered call from', target:'+351 912 *** 456', type: 'incoming'},
    {time: '14:59', agent: 'Tiago Ribeiro', action: 'resolved billing ticket from', target:'ABC Company', type: 'resolved'},
    {time: '14:55', agent: 'Beatriz Costa', action: 'missed call from', target:'+351 933 *** 789', type: 'missed'},
    {time: '14:48', agent: 'João Santos', action: 'transferred call to', target:'Supervisor', type: 'transfer'},
  ]

  volumeCallsChart!: VolumeCallsChartOptions;
  topCallReasonsChart!: TopCallReasonsChartOptions;

  displayValue = 0;
  currentActualValue = 0;
  selectedReason = this.callReasons[0];
  private animationFrame: any = null;

  ngOnInit(){
    this.selectedReason = this.callReasons[0];
    this.currentActualValue = this.selectedReason.value;
    this.animateValue(0, this.selectedReason.value);
  }

  resetReason(){
    if (this.selectedReason.name !== this.callReasons[0].name){
      this.hoverReason(this.callReasons[0]);
    }
  }

  hoverReason(reason: any){
    if (this.selectedReason.name === reason.name) return;

    const start = this.currentActualValue;
    const end = reason.value;

    this.selectedReason = reason;
    this.currentActualValue = end;
    this.animateValue(start, end);

  }

  private animateValue(startValue: number, endValue: number){
    if(this.animationFrame){
      cancelAnimationFrame(this.animationFrame);
    }

    const startTime = performance.now();
    const duration = 200;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      this.displayValue = Math.round(
        startValue + (endValue - startValue ) * easeProgress
      );

      this.cdr.detectChanges();

      if (progress < 1){
        this.animationFrame = requestAnimationFrame(animate);
      } else {
        this.displayValue = endValue;
        this.cdr.detectChanges();
        this.animationFrame = null;
      }
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

 



  

}
