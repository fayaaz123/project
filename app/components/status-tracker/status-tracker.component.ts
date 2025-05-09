import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimService } from '../../claim.service';
import { Claim } from '../../claim.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-status-tracker',
  standalone: true,
  templateUrl: './status-tracker.component.html',
  styleUrls: ['./status-tracker.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class StatusTrackerComponent implements OnInit {
  claims: Claim[] = [];
  selectedClaim: Claim | null = null;
  modalOpen = false;
  isLoading = false;

  emailInput: string = '';
  emailSubmitted: boolean = false;

  constructor(private claimService: ClaimService) {}

  ngOnInit(): void {}

  // Triggered after entering email
  fetchClaims(): void {
    if (!this.emailInput || !this.emailInput.trim()) return;

    this.isLoading = true;
    this.emailSubmitted = true;

    this.claimService.getClaimsByEmail(this.emailInput.trim().toLowerCase()).subscribe({
      next: (res: Claim[]) => {
        this.claims = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching claims:', err);
        this.claims = [];
        this.isLoading = false;
      }
    });
  }

  openModal(claim: Claim): void {
    this.selectedClaim = claim;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.selectedClaim = null;
    this.modalOpen = false;
  }

  getAgentStatusColor(status: string | undefined): string {
    switch (status) {
      case 'APPROVED': return 'bg-success';
      case 'REJECTED': return 'bg-danger';
      case 'OPEN': default: return 'bg-primary';
    }
  }

  getAdminStatusColor(status: string | undefined): string {
    switch (status) {
      case 'ADMIN_APPROVED': return 'bg-success';
      case 'ADMIN_REJECTED': return 'bg-danger';
      case 'PENDING': default: return 'bg-warning';
    }
  }
}
