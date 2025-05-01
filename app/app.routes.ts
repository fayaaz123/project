import { Routes } from '@angular/router';
import { SubmitClaimComponent } from './components/submit-claim/submit-claim.component';
import { StatusTrackerComponent } from './components/status-tracker/status-tracker.component';
import { AgentDashboardComponent } from './components/agent-dashboard/agent-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'submit-claim', pathMatch: 'full' },

  { path: 'submit-claim', component: SubmitClaimComponent },
  { path: 'track-status', component: StatusTrackerComponent },
  { path: 'agent-dashboard', component: AgentDashboardComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },

  { path: '**', redirectTo: 'submit-claim' } // fallback
];
