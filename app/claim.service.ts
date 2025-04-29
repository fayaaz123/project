import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Claim } from './claim.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  // You can keep this for future use when connecting to the backend
  private apiUrl = 'http://localhost:3000/api/claims';

  // Inject HttpClient in the constructor
  constructor(private http: HttpClient) {}

  // Mock function to simulate claim submission
  submitClaim(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
  
  getAllClaims(): Observable<Claim[]> {
    return this.http.get<Claim[]>(this.apiUrl);
  }
  
  getClaimsByStatus(status: string): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.apiUrl}?status=${status}`);
  }
  getClaimsByEmail(email: string) {
    return this.http.get<Claim[]>(`${this.apiUrl}?email=${email}`);
  }
  
  approveClaim(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/approve`, {});
  }
  
  rejectClaim(id: string, reason: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/reject`, { rejectionReason: reason });
  }
  
  adminFinalApprove(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/admin-approve`, {});
  }
  
  adminFinalReject(id: string, reason: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/admin-reject`, { adminRejectionReason: reason });
  }  
}
