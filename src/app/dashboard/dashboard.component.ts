import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { AuthService } from '../services/auth.service';
import { DashboardService } from '../services/dashboard.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboardData: any;
  users: any[] = [];
  userKeys: string[] = [];

  isLoading = true;
  errorMessage = '';

  donutChart: any;
  barChart: any;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDashboard();
  }

  ngOnDestroy(): void {
    if (this.donutChart) {
      this.donutChart.destroy();
    }

    if (this.barChart) {
      this.barChart.destroy();
    }
  }

  loadDashboard(): void {
    this.dashboardService.getDashboard().subscribe({
      next: (res) => {
        this.dashboardData = res;
        this.users = res.tableUsers || [];
        this.userKeys = this.users.length > 0 ? Object.keys(this.users[0]) : [];

        setTimeout(() => {
          this.createDonutChart(res.chartDonut || []);
          this.createBarChart(res.chartBar || []);
        }, 100);

        this.isLoading = false;
      },
      error: (error) => {
        if (error.status === 401) {
          if (this.authService.isLocalSession()) {
            this.errorMessage = 'Logged in using local PouchDB credentials. Dashboard API requires a valid Bearer token.';
            this.isLoading = false;
            return;
          }

          this.authService.logout();
          this.router.navigate(['/login']);
          return;
        }

        this.errorMessage = 'Unable to load dashboard data.';
        this.isLoading = false;
      }
    });
  }

  createDonutChart(data: any[]): void {
    const labels = data.map((item: any, index: number) =>
      item.label ||
      item.Label ||
      item.name ||
      item.Name ||
      item.category ||
      item.Category ||
      item.x ||
      item.X ||
      `Item ${index + 1}`
    );

    const values = data.map((item: any) => {
      const rawValue =
        item.value ??
        item.Value ??
        item.total ??
        item.Total ??
        item.count ??
        item.Count ??
        item.y ??
        item.Y ??
        item.data ??
        item.Data ??
        0;

      return Number(rawValue);
    });

    this.donutChart?.destroy();

    this.donutChart = new Chart('donutChart', {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: [
              '#2f2f2f',
              '#4a4a4a',
              '#666666',
              '#808080',
              '#999999',
              '#b3b3b3',
              '#cccccc'
            ],
            borderColor: '#ffffff',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  createBarChart(data: any[]): void {
    const labels = data.map((item: any, index: number) =>
      item.label ||
      item.Label ||
      item.name ||
      item.Name ||
      item.month ||
      item.Month ||
      item.category ||
      item.Category ||
      item.x ||
      item.X ||
      item.title ||
      item.Title ||
      `Item ${index + 1}`
    );

    const values = data.map((item: any) => {
      const rawValue =
        item.value ??
        item.Value ??
        item.total ??
        item.Total ??
        item.count ??
        item.Count ??
        item.amount ??
        item.Amount ??
        item.y ??
        item.Y ??
        item.data ??
        item.Data ??
        0;

      return Number(rawValue);
    });

    this.barChart?.destroy();

    this.barChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Total',
            data: values,
            backgroundColor: '#666666',
            borderColor: '#2f2f2f',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  formatColumnName(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase())
      .trim();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}