import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimService } from '../../claim.service';
import { FormsModule } from '@angular/forms';
import { Claim } from '../../claim.model'; // Correct import

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class AdminDashboardComponent implements OnInit {
  claims: Claim[] = [];
  filteredClaims: Claim[] = [];
  searchText: string = '';
  isLoading = false;

  selectedClaim: Claim | null = null;
  modalOpen = false;
  isSubmitting = false;

  constructor(private claimService: ClaimService) {}

  ngOnInit(): void {
    this.fetchClaims();
  }

  fetchClaims(): void {
    this.isLoading = true;
    this.claimService.getClaimsByStatus('APPROVED').subscribe({
      next: (res: Claim[]) => { // 🔥 Proper typing here
        this.claims = res;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching claims:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.claims];

    if (this.searchText.trim()) {
      const keyword = this.searchText.trim().toLowerCase();
      filtered = filtered.filter(claim =>
        claim.claimId?.toLowerCase().includes(keyword) ||
        claim.location?.city?.toLowerCase().includes(keyword)
      );
    }

    this.filteredClaims = filtered.sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  openModal(claim: Claim): void { // 🔥 Claim type used here
    this.selectedClaim = claim;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.selectedClaim = null;
    this.modalOpen = false;
  }

  finalApprove(): void {
    if (!this.selectedClaim) return;
    if (confirm('Are you sure you want to FINAL approve this claim?')) {
      this.isSubmitting = true;
      this.claimService.adminFinalApprove(this.selectedClaim.claimId!).subscribe(() => {
        this.isSubmitting = false;
        this.closeModal();
        this.fetchClaims();
      });
    }
  }

  finalReject(): void {
    if (!this.selectedClaim) return;
    const reason = prompt('Enter final rejection reason:');
    if (reason && reason.trim()) {
      this.isSubmitting = true;
      this.claimService.adminFinalReject(this.selectedClaim.claimId!, reason).subscribe(() => {
        this.isSubmitting = false;
        this.closeModal();
        this.fetchClaims();
      });
    }
  }
}
