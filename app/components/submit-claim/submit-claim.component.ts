import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClaimService } from '../../claim.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-submit-claim',
  standalone: true,
  templateUrl: './submit-claim.component.html',
  styleUrls: ['./submit-claim.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class SubmitClaimComponent {
  claimForm: FormGroup;
  otherReasonVisible = false;
  photoFiles: File[] = [];
  photoPreviews: string[] = [];
  pdfFile: File | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private claimService: ClaimService
  ) {
    this.claimForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      reason: ['', Validators.required],
      customReason: [''],
      explanation: ['', [Validators.required, Validators.minLength(10)]],
      street: ['', [Validators.required, Validators.minLength(3)]],
      city: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      state: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      photos: [null],
      policeReport: [null]
    });    
  }

  onReasonChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.otherReasonVisible = value === 'Others';
    if (!this.otherReasonVisible) {
      this.claimForm.get('customReason')?.setValue('');
    }
  }

  onPhotoUpload(event: any) {
    const files: File[] = Array.from(event.target.files);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    this.photoFiles = [];
    this.photoPreviews = [];

    for (let file of files) {
      if (allowedTypes.includes(file.type)) {
        this.photoFiles.push(file);
        this.photoPreviews.push(URL.createObjectURL(file));
      } else {
        alert(`❌ "${file.name}" is not a supported image format.`);
      }
    }
  }

  onPdfUpload(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.pdfFile = file;
    } else {
      alert('❌ Only PDF files are allowed for the police report.');
    }
  }
  removePhoto(index: number): void {
    if (this.photoPreviews && this.photoPreviews.length > index) {
      // Remove the photo from previews array
      this.photoPreviews.splice(index, 1);
      
      // If you're also maintaining a separate array of File objects for upload,
      // you should remove the corresponding file as well
      if (this.photoFiles && this.photoFiles.length > index) {
        this.photoFiles.splice(index, 1);
      }
    }
  }
  onSubmit() {
    if (this.claimForm.invalid) {
      this.claimForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    const formValue = this.claimForm.value;

    formData.append('fullName', formValue.fullName);
    formData.append('email', formValue.email);
    formData.append('reason', formValue.reason);
    if (formValue.reason === 'Others') {
      formData.append('customReason', formValue.customReason);
    }
    formData.append('explanation', formValue.explanation);
    formData.append('street', formValue.street);
    formData.append('city', formValue.city);
    formData.append('state', formValue.state);
    formData.append('pincode', formValue.pincode);

    this.photoFiles.forEach((file) => {
      formData.append('photos', file);
    });

    if (this.pdfFile) {
      formData.append('policeReport', this.pdfFile);
    }

    this.claimService.submitClaim(formData).subscribe({
      next: (response) => {
        console.log('✅ Claim submitted successfully:', response);
        alert('✅ Claim submitted successfully!');
        this.resetForm();
      },
      error: (error) => {
        console.error('❌ Error submitting claim:', error);
        alert('❌ There was an error submitting your claim. Please try again.');
        this.isSubmitting = false;
      }
    });
  }

  private resetForm() {
    this.claimForm.reset();
    this.claimForm.markAsPristine();
    this.claimForm.markAsUntouched();
    this.photoFiles = [];
    this.photoPreviews = [];
    this.pdfFile = null;
    this.otherReasonVisible = false;
    this.isSubmitting = false;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.claimForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
