import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private publicKey = 'DdXLBN-DBxoZlfZlD';
  private serviceId = 'service_nqh92vq';
  private templateId = 'template_94sadug';

  constructor() {
    emailjs.init(this.publicKey);
  }

  async sendVerificationEmail(email: string, link: string): Promise<void> {
    const templateParams = {
      to_email: email,
      link: link,
    };

    try {
      await emailjs.send(this.serviceId, this.templateId, templateParams);
      console.log('Email sent successfully!');
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
}
