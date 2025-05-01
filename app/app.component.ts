import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SubmitClaimComponent } from "./components/submit-claim/submit-claim.component";
import { AgentDashboardComponent } from "./components/agent-dashboard/agent-dashboard.component";
import { AdminDashboardComponent } from "./components/admin-dashboard/admin-dashboard.component";
import { StatusTrackerComponent } from "./components/status-tracker/status-tracker.component";
import { AdminInsightsComponent } from "./components/admin-insights/admin-insights.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SubmitClaimComponent, AgentDashboardComponent, AdminDashboardComponent, StatusTrackerComponent, RouterLink, AdminInsightsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'auto-insurance-system';
}
