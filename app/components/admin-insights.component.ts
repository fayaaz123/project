import { Component, OnInit } from '@angular/core';
import { ClaimService } from '../../claim.service';
import { ChartConfiguration, ChartData } from 'chart.js';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { fadeInOnEnterAnimation, fadeInUpOnEnterAnimation, zoomInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-admin-insights',
  standalone: true,
  templateUrl: './admin-insights.component.html',
  styleUrls: ['./admin-insights.component.scss'],
  imports: [CommonModule, BaseChartDirective],
  animations: [
    fadeInOnEnterAnimation({ duration: 500 }),
    fadeInUpOnEnterAnimation({ duration: 600, delay: 100 }),
    zoomInOnEnterAnimation({ duration: 600, delay: 200 })
  ]
})
export class AdminInsightsComponent implements OnInit {
  totalClaims = 0;
  agentApproved = 0;
  agentRejected = 0;
  adminApproved = 0;
  adminRejected = 0;
  pendingFinal = 0;
  isLoading = true;

  // Modern chart data
  pieChartData: ChartData<'pie'> = {
    labels: ['Approved', 'Rejected', 'Pending'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: [
        'rgba(40, 167, 69, 0.8)',
        'rgba(220, 53, 69, 0.8)',
        'rgba(255, 193, 7, 0.8)'
      ],
      borderColor: [
        'rgba(40, 167, 69, 1)',
        'rgba(220, 53, 69, 1)',
        'rgba(255, 193, 7, 1)'
      ],
      borderWidth: 1,
      hoverOffset: 10
    }]
  };

  barChartData: ChartData<'bar'> = {
    labels: ['Agent Approved', 'Agent Rejected', 'Total Claims'],
    datasets: [{
      label: 'Claims Summary',
      data: [0, 0, 0],
      backgroundColor: [
        'rgba(23, 162, 184, 0.7)',
        'rgba(232, 62, 140, 0.7)',
        'rgba(108, 117, 125, 0.7)'
      ],
      borderColor: [
        'rgba(23, 162, 184, 1)',
        'rgba(232, 62, 140, 1)',
        'rgba(108, 117, 125, 1)'
      ],
      borderWidth: 1,
      borderRadius: 6,
      barThickness: 30
    }]
  };

  // Separate options for each chart type
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        },
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        },
        padding: 12,
        cornerRadius: 8
      }
    }
  };

  constructor(private claimService: ClaimService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.claimService.getAllClaims().subscribe({
      next: (claims) => {
        this.processClaimsData(claims);
        this.updateCharts();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading claims:', err);
        this.initializeWithDefaults();
        this.isLoading = false;
      }
    });
  }

  private processClaimsData(claims: any[]): void {
    this.totalClaims = claims.length;
    this.agentApproved = claims.filter(c => c.status === 'APPROVED').length;
    this.agentRejected = claims.filter(c => c.status === 'REJECTED').length;
    this.adminApproved = claims.filter(c => c.adminFinalStatus === 'ADMIN_APPROVED').length;
    this.adminRejected = claims.filter(c => c.adminFinalStatus === 'ADMIN_REJECTED').length;
    this.pendingFinal = claims.filter(c => c.adminFinalStatus === 'PENDING').length;
  }

  private initializeWithDefaults(): void {
    this.totalClaims = 0;
    this.agentApproved = 0;
    this.agentRejected = 0;
    this.adminApproved = 0;
    this.adminRejected = 0;
    this.pendingFinal = 0;
    this.updateCharts();
  }

  private updateCharts(): void {
    // Update pie chart data
    this.pieChartData = {
      ...this.pieChartData,
      datasets: [{
        ...this.pieChartData.datasets[0],
        data: [this.adminApproved, this.adminRejected, this.pendingFinal]
      }]
    };

    // Update bar chart data
    this.barChartData = {
      ...this.barChartData,
      datasets: [{
        ...this.barChartData.datasets[0],
        data: [this.agentApproved, this.agentRejected, this.totalClaims]
      }]
    };
  }
}