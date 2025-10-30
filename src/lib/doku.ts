/**
 * DOKU Payment Gateway Library
 * Sandbox Mode - FREE Testing dengan Virtual Cards
 * 
 * Virtual Cards untuk Testing:
 * - Card: 5401 2345 6789 0123
 * - Expiry: 12/25
 * - CVV: 123
 */

import crypto from 'crypto'

interface DokuConfig {
  clientId: string
  secretKey: string
  baseUrl: string
}

interface PaymentRequest {
  amount: number
  invoiceNumber: string
  customerName: string
  customerEmail: string
  description: string
  returnUrl: string
  expiredTime?: number // in minutes, default 60
}

interface VirtualAccountRequest {
  amount: number
  invoiceNumber: string
  customerName: string
  customerEmail: string
  expiredTime?: number // in minutes, default 1440 (24 hours)
}

interface CreditCardPayment {
  cardNumber: string
  cardExpMonth: string // MM
  cardExpYear: string // YY
  cardCvv: string
  amount: number
  invoiceNumber: string
  customerName: string
  customerEmail: string
}

export class DokuPayment {
  private config: DokuConfig

  constructor() {
    this.config = {
      clientId: process.env.DOKU_CLIENT_ID || '',
      secretKey: process.env.DOKU_SECRET_KEY || '',
      baseUrl: process.env.DOKU_BASE_URL || 'https://api-sandbox.doku.com',
    }

    if (!this.config.clientId || !this.config.secretKey) {
      throw new Error('DOKU credentials not configured. Check your .env.local file.')
    }
  }

  /**
   * Generate DOKU Signature
   * Format: HMACSHA256(ClientId:RequestTimestamp:RequestTarget, SecretKey)
   */
  private generateSignature(
    requestTimestamp: string,
    requestTarget: string
  ): string {
    const stringToSign = `${this.config.clientId}:${requestTimestamp}:${requestTarget}`
    
    const signature = crypto
      .createHmac('sha256', this.config.secretKey)
      .update(stringToSign)
      .digest('hex')
    
    return signature
  }

  /**
   * Generate Request ID (unique per request)
   */
  private generateRequestId(): string {
    return `REQ-${Date.now()}-${Math.random().toString(36).substring(7)}`
  }

  /**
   * Create Payment with Credit/Debit Card
   * Custom payment page - Direct card processing
   */
  async createCreditCardPayment(data: CreditCardPayment) {
    const requestTimestamp = new Date().toISOString()
    const requestTarget = '/v1/payment/credit-card'
    const signature = this.generateSignature(requestTimestamp, requestTarget)

    const payload = {
      client_id: this.config.clientId,
      request_id: this.generateRequestId(),
      request_timestamp: requestTimestamp,
      order: {
        invoice_number: data.invoiceNumber,
        amount: data.amount,
        currency: 'IDR',
      },
      customer: {
        name: data.customerName,
        email: data.customerEmail,
      },
      credit_card: {
        card_number: data.cardNumber.replace(/\s/g, ''),
        card_exp_month: data.cardExpMonth,
        card_exp_year: data.cardExpYear,
        card_cvv: data.cardCvv,
      },
    }

    try {
      const response = await fetch(`${this.config.baseUrl}${requestTarget}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Client-Id': this.config.clientId,
          'Request-Id': payload.request_id,
          'Request-Timestamp': requestTimestamp,
          'Signature': signature,
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Payment failed')
      }

      return {
        success: true,
        data: result,
      }
    } catch (error) {
      console.error('DOKU Credit Card Payment Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Create Virtual Account Payment
   * Generate VA number for bank transfer
   */
  async createVirtualAccount(data: VirtualAccountRequest) {
    const requestTimestamp = new Date().toISOString()
    const requestTarget = '/v1/payment/virtual-account'
    const signature = this.generateSignature(requestTimestamp, requestTarget)

    const expiredTime = data.expiredTime || 1440 // 24 hours default
    const expiredDate = new Date(Date.now() + expiredTime * 60000).toISOString()

    const payload = {
      client_id: this.config.clientId,
      request_id: this.generateRequestId(),
      request_timestamp: requestTimestamp,
      order: {
        invoice_number: data.invoiceNumber,
        amount: data.amount,
        currency: 'IDR',
      },
      virtual_account: {
        expired_time: expiredDate,
      },
      customer: {
        name: data.customerName,
        email: data.customerEmail,
      },
    }

    try {
      const response = await fetch(`${this.config.baseUrl}${requestTarget}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Client-Id': this.config.clientId,
          'Request-Id': payload.request_id,
          'Request-Timestamp': requestTimestamp,
          'Signature': signature,
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'VA creation failed')
      }

      return {
        success: true,
        data: result,
      }
    } catch (error) {
      console.error('DOKU Virtual Account Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Create QRIS Payment
   * Generate QR code for scan & pay
   */
  async createQRISPayment(data: PaymentRequest) {
    const requestTimestamp = new Date().toISOString()
    const requestTarget = '/v1/payment/qris'
    const signature = this.generateSignature(requestTimestamp, requestTarget)

    const expiredTime = data.expiredTime || 60 // 60 minutes default
    const expiredDate = new Date(Date.now() + expiredTime * 60000).toISOString()

    const payload = {
      client_id: this.config.clientId,
      request_id: this.generateRequestId(),
      request_timestamp: requestTimestamp,
      order: {
        invoice_number: data.invoiceNumber,
        amount: data.amount,
        currency: 'IDR',
      },
      qris: {
        expired_time: expiredDate,
      },
      customer: {
        name: data.customerName,
        email: data.customerEmail,
      },
    }

    try {
      const response = await fetch(`${this.config.baseUrl}${requestTarget}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Client-Id': this.config.clientId,
          'Request-Id': payload.request_id,
          'Request-Timestamp': requestTimestamp,
          'Signature': signature,
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'QRIS payment failed')
      }

      return {
        success: true,
        data: result,
      }
    } catch (error) {
      console.error('DOKU QRIS Payment Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Check Payment Status
   */
  async checkPaymentStatus(invoiceNumber: string) {
    const requestTimestamp = new Date().toISOString()
    const requestTarget = `/v1/payment/status/${invoiceNumber}`
    const signature = this.generateSignature(requestTimestamp, requestTarget)

    try {
      const response = await fetch(`${this.config.baseUrl}${requestTarget}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Client-Id': this.config.clientId,
          'Request-Timestamp': requestTimestamp,
          'Signature': signature,
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Status check failed')
      }

      return {
        success: true,
        data: result,
      }
    } catch (error) {
      console.error('DOKU Payment Status Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Verify Webhook Signature
   * Use this in callback endpoint to verify authenticity
   */
  verifyWebhookSignature(
    receivedSignature: string,
    requestTimestamp: string,
    requestBody: string
  ): boolean {
    const stringToSign = `${this.config.clientId}:${requestTimestamp}:${requestBody}`
    
    const calculatedSignature = crypto
      .createHmac('sha256', this.config.secretKey)
      .update(stringToSign)
      .digest('hex')
    
    return calculatedSignature === receivedSignature
  }
}

// Export singleton instance
export const dokuPayment = new DokuPayment()
