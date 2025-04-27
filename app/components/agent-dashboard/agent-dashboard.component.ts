import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimService } from '../../claim.service';
import { FormsModule } from '@angular/forms';
import { Claim } from '../../claim.model'; // Correct import path to your models folder

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class AgentDashboardComponent implements OnInit {
  claims: Claim[] = [];
  filteredClaims: Claim[] = [];
  statusFilter: string = 'ALL';
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
    this.claimService.getAllClaims().subscribe({
      next: (res: Claim[]) => {   // 🔥 Typing the response as Claim[]
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

    if (this.statusFilter !== 'ALL') {
      filtered = filtered.filter(claim => claim.status === this.statusFilter);
    }

    if (this.searchText.trim()) {
      const keyword = this.searchText.trim().toLowerCase();
      filtered = filtered.filter(claim =>
        claim.claimId?.toLowerCase().includes(keyword) ||  // 🔥 Add optional chaining (_id can be undefined)
        claim.location?.city?.toLowerCase().includes(keyword)
      );
    }

    this.filteredClaims = filtered.sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  onStatusChange(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  openModal(claim: Claim): void { // 🔥 claim should be of type Claim
    this.selectedClaim = claim;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.selectedClaim = null;
    this.modalOpen = false;
  }

  approveSelectedClaim(): void {
    if (!this.selectedClaim) return;
    if (confirm('Are you sure you want to approve this claim?')) {
      this.isSubmitting = true;
      this.claimService.approveClaim(this.selectedClaim.claimId!).subscribe(() => {
        this.isSubmitting = false;
        this.closeModal();
        this.fetchClaims();
      });
    }
  }

  rejectSelectedClaim(): void {
    if (!this.selectedClaim) return;
    const reason = prompt('Enter rejection reason:');
    if (reason && reason.trim()) {
      this.isSubmitting = true;
      this.claimService.rejectClaim(this.selectedClaim.claimId!, reason).subscribe(() => {
        this.isSubmitting = false;
        this.closeModal();
        this.fetchClaims();
      });
    }
  }
}
