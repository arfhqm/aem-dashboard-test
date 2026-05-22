import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardResponse {
  success: boolean;
  chartDonut: any[];
  chartBar: any[];
  tableUsers: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private dashboardUrl = 'http://test-demo.aemenersol.com/api/dashboard';

  constructor(private http: HttpClient) { }

  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(this.dashboardUrl);
  }
}