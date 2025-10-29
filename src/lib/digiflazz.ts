import md5 from 'md5'

const DIGIFLAZZ_BASE_URL = 'https://api.digiflazz.com/v1'

export interface DigiflazzConfig {
  username: string
  apiKey: string
  sandbox: boolean
}

export interface DigiflazzProduct {
  product_name: string
  category: string
  brand: string
  type: string
  seller_name: string
  price: number
  buyer_sku_code: string
  buyer_product_status: boolean
  seller_product_status: boolean
  unlimited_stock: boolean
  stock: number
  multi: boolean
  start_cut_off: string
  end_cut_off: string
  desc: string
}

export interface DigiflazzCheckUserResponse {
  data: {
    rc: string
    message: string
    username?: string
    sn?: string
  }
}

export interface DigiflazzTransactionResponse {
  data: {
    ref_id: string
    status: string
    customer_no: string
    buyer_sku_code: string
    message: string
    price: number
    sn?: string
  }
}

export class DigiflazzClient {
  private config: DigiflazzConfig

  constructor(config: DigiflazzConfig) {
    this.config = config
  }

  /**
   * Generate signature untuk authentication
   */
  private generateSignature(data?: any): string {
    const apiKey = this.config.apiKey
    const username = this.config.username
    const ref_id = data?.ref_id || ''
    
    return md5(username + apiKey + ref_id)
  }

  /**
   * Make API request ke Digiflazz
   */
  private async makeRequest(endpoint: string, data: any) {
    const url = `${DIGIFLAZZ_BASE_URL}${endpoint}`
    
    const signature = this.generateSignature(data)
    
    const payload = {
      username: this.config.username,
      sign: signature,
      ...data,
    }

    console.log('Digiflazz Request:', { url, payload: { ...payload, sign: '[HIDDEN]' } })

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Digiflazz API Error: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('Digiflazz Response:', result)
    
    return result
  }

  /**
   * Cek harga list produk
   */
  async getPriceList(): Promise<DigiflazzProduct[]> {
    const result = await this.makeRequest('/price-list', {
      cmd: 'prepaid',
    })
    
    return result.data || []
  }

  /**
   * Cek User ID game (validasi + ambil nickname)
   */
  async checkGameUser(
    buyerSkuCode: string,
    customerId: string,
    testing?: boolean
  ): Promise<DigiflazzCheckUserResponse> {
    const result = await this.makeRequest('/cek-username', {
      buyer_sku_code: buyerSkuCode,
      customer_no: customerId,
      testing: testing !== undefined ? testing : this.config.sandbox,
    })
    
    return result
  }

  /**
   * Kirim transaksi top-up
   */
  async topUp(
    buyerSkuCode: string,
    customerId: string,
    refId: string,
    testing?: boolean
  ): Promise<DigiflazzTransactionResponse> {
    const result = await this.makeRequest('/transaction', {
      buyer_sku_code: buyerSkuCode,
      customer_no: customerId,
      ref_id: refId,
      testing: testing !== undefined ? testing : this.config.sandbox,
    })
    
    return result
  }

  /**
   * Cek status transaksi
   */
  async checkTransaction(refId: string): Promise<any> {
    const result = await this.makeRequest('/transaction', {
      ref_id: refId,
      cmd: 'status',
    })
    
    return result
  }

  /**
   * Get deposit saldo (untuk production)
   */
  async getBalance(): Promise<{ balance: number }> {
    const result = await this.makeRequest('/cek-saldo', {
      cmd: 'deposit',
    })
    
    return {
      balance: result.data?.deposit || 0,
    }
  }
}

// Export singleton instance
export const digiflazz = new DigiflazzClient({
  username: process.env.DIGIFLAZZ_USERNAME || '',
  apiKey: process.env.DIGIFLAZZ_API_KEY || 'dev',
  sandbox: process.env.DIGIFLAZZ_SANDBOX === 'true',
})
