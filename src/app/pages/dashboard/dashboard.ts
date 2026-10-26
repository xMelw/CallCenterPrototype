import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
} from "ng-apexcharts";

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
  imports: [NgClass, ChartComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  constructor(private cdr: ChangeDetectorRef){
    this.volumeCallsChart = { // Configuração do gráfico (Volume de Chamadas)
      series: [
        {
            name: 'Recebidas',
          data: [12, 18, 24, 29, 22, 34, 31]
        },
        {
            name: 'Atendidas',
          data: [10, 15, 21, 25, 19, 26, 28]
        },
        {
            name: 'Perdidas',
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
          formatter: (val) => `${val} chamadas`
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
    {title: 'Chamadas recebidas', time: 'Últimos 7 dias', number: '184', compare:'+5%'},
    {title: 'Chamadas atendidas', time: 'Últimos 7 dias', number: '163', compare:'+7%'},
    {title: 'Chamadas perdidas', time: 'Últimos 7 dias', number: '21', compare:'-2%'},
    {title: 'Tempo online', time: 'média diária', onlineTime: '7,8'}
  ]

  callReasons = [
    {name: 'Suporte técnico', value: 76, color: '#4F8CFF'},
    {name: 'Faturação', value: 68, color: '#F97316'},
    {name: 'Encomendas', value: 57, color: '#8B5CF6'},
    {name: 'Devoluções', value: 43, color: '#10B981'},
    {name: 'Informações gerais', value: 30, color: '#ef4444'}
  ]

  bestAgents = [
    {name: 'Mariana Costa', role: 'Apoio ao Cliente', calls: 142, rating: 4.9, avatar: 'MC', status: 'Excelente'},
    {name: 'Pedro Santos', role: 'Suporte Técnico', calls: 128, rating: 4.8, avatar: 'PS', status: 'Excelente'},
    {name: 'Inês Ferreira', role: 'Faturação e Contas', calls: 115, rating: 4.7, avatar: 'IF', status: 'Muito bom'},
    {name: 'Catarina Rocha', role: 'Retenção e Vendas', calls: 98, rating: 4.6, avatar: 'CR', status: 'Muito bom'},
  ]

  realTimeLogs = [
    {time: '15:04', agent: 'Mariana Costa', action: 'atendeu a chamada de', target:'+351 912 *** 456', type: 'incoming'},
    {time: '14:59', agent: 'Inês Ferreira', action: 'resolveu um pedido de faturação de', target:'TechVentures', type: 'resolved'},
    {time: '14:55', agent: 'Pedro Santos', action: 'não conseguiu atender', target:'+351 933 *** 789', type: 'missed'},
    {time: '14:48', agent: 'Ricardo Silva', action: 'encaminhou a chamada para', target:'Supervisão', type: 'transfer'},
  ]

  volumeCallsChart!: VolumeCallsChartOptions;
  topCallReasonsChart!: TopCallReasonsChartOptions;

  displayValue = 0;
  selectedReason = this.callReasons[0];

  ngOnInit(){
    this.selectedReason = this.callReasons[0];
    this.displayValue = this.selectedReason.value;
  }

  resetReason(){
    if (this.selectedReason.name !== this.callReasons[0].name){
      this.hoverReason(this.callReasons[0]);
    }
  }

  hoverReason(reason: any){
    if (this.selectedReason.name === reason.name) return;

    const end = reason.value;

    this.selectedReason = reason;
    this.displayValue = end;
    this.cdr.detectChanges();
  }

 



  

}
