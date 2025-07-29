const axios = require('axios');
const crypto = require('crypto');
const os = require('os');
const querystring = require('querystring');

/**
 * Client library for Payssion API.
 */
class PayssionClient {
    /**
     * @const {string}
     */
    static VERSION = '1.3.1';

    /**
     * Constructor
     * @param {string} apiKey - Payssion App api_key
     * @param {string} secretKey - Payssion App secret_key
     * @param {boolean} isLivemode - false if you use sandbox api_key and true for live mode
     */
    constructor(apiKey, secretKey, isLivemode = true) {
        this.apiKey = apiKey;
        this.secretKey = secretKey;
        this.isSuccess = false;
        this.sslVerify = true;

        // Signature keys for different methods
        this.sigKeys = {
            create: [
                'api_key',
                'pm_id',
                'amount',
                'currency',
                'order_id',
                'secret_key'
            ],
            details: [
                'api_key',
                'transaction_id',
                'order_id',
                'secret_key'
            ],
            refund: [
                'api_key',
                'transaction_id',
                'amount',
                'currency',
                'secret_key'
            ]
        };

        // HTTP error messages
        this.httpErrors = {
            400: '400 Bad Request',
            401: '401 Unauthorized',
            500: '500 Internal Server Error',
            501: '501 Not Implemented',
            502: '502 Bad Gateway',
            503: '503 Service Unavailable',
            504: '504 Gateway Timeout'
        };

        // Allowed request methods
        this.allowedRequestMethods = ['get', 'put', 'post', 'delete'];

        // Validate parameters
        this.validateParams({
            [!apiKey]: 'api_key is not set!',
            [!secretKey]: 'secret_key is not set!'
        });

        this.setLiveMode(isLivemode);
    }

    /**
     * Set LiveMode
     * @param {boolean} isLivemode
     */
    setLiveMode(isLivemode) {
        if (isLivemode) {
            this.apiUrl = 'https://www.payssion.com/api/v1/';
        } else {
            this.apiUrl = 'http://sandbox.payssion.com/api/v1/';
        }
    }

    /**
     * Set Api URL
     * @param {string} url - Api URL
     */
    setUrl(url) {
        this.apiUrl = url;
    }

    /**
     * Sets SSL verify
     * @param {boolean} sslVerify - SSL verify
     */
    setSSLverify(sslVerify) {
        this.sslVerify = sslVerify;
    }

    /**
     * Request state getter
     * @return {boolean}
     */
    getIsSuccess() {
        return this.isSuccess;
    }

    /**
     * Create payment order
     * @param {Object} params - create Params
     * @return {Promise<Object>}
     */
    async create(params) {
        return await this.call('create', 'post', params, 'payment/create');
    }

    /**
     * Get payment details
     * @param {Object} params - query Params
     * @return {Promise<Object>}
     */
    async getDetails(params) {
        return await this.call('details', 'post', params, 'payment/details');
    }

    /**
     * Refund
     * @param {Object} params - query Params
     * @return {Promise<Object>}
     */
    async refund(params) {
        return await this.call('refund', 'post', params, 'refunds');
    }

    /**
     * Method responsible for preparing, setting state and returning answer from rest server
     * @param {string} method
     * @param {string} request
     * @param {Object} params
     * @param {string} urlSuffix
     * @return {Promise<Object>}
     */
    async call(method, request, params, urlSuffix) {
        this.isSuccess = false;

        // Validate parameters
        this.validateParams({
            [typeof method !== 'string']: 'Method name must be string',
            [!this.checkRequestMethod(request)]: 'Not allowed request method type',
            [!params || Object.keys(params).length === 0]: 'params is null'
        });

        params.api_key = this.apiKey;
        params.api_sig = this.getSig(params, this.sigKeys[method]);

        const response = await this.pushData(urlSuffix, request, params);

        if (response.result_code && response.result_code === 200) {
            this.isSuccess = true;
        }

        return response;
    }

    /**
     * Generate signature
     * @param {Object} params
     * @param {Array} sigKeys
     * @return {string}
     */
    getSig(params, sigKeys) {
        const msgArray = {};
        sigKeys.forEach(key => {
            msgArray[key] = params[key] || '';
        });
        msgArray.secret_key = this.secretKey;

        const msg = Object.values(msgArray).join('|');
        return crypto.createHash('md5').update(msg).digest('hex');
    }

    /**
     * Checking error mechanism
     * @param {Object} validateParams
     * @throws {Error}
     */
    validateParams(validateParams) {
        for (const [condition, error] of Object.entries(validateParams)) {
            if (condition === 'true' || condition === true) {
                throw new Error(error);
            }
        }
    }

    /**
     * Check if method is allowed
     * @param {string} methodType
     * @return {boolean}
     */
    checkRequestMethod(methodType) {
        const requestMethod = methodType.toLowerCase();
        return this.allowedRequestMethods.includes(requestMethod);
    }

    /**
     * Method responsible for pushing data to server
     * @param {string} urlSuffix
     * @param {string} methodType
     * @param {Object} vars
     * @return {Promise<Object>}
     * @throws {Error}
     */
    async pushData(urlSuffix, methodType, vars) {
        const url = this.apiUrl + urlSuffix;
        const data = querystring.stringify(vars);
        const headers = this.getHeaders();

        try {
            const config = {
                method: 'POST',
                url: url,
                data: data,
                headers: headers,
                timeout: 30000
            };

            if (!this.sslVerify) {
                config.httpsAgent = new (require('https').Agent)({
                    rejectUnauthorized: false
                });
            }

            const response = await axios(config);
            return response.data;
        } catch (error) {
            if (error.response) {
                const code = error.response.status;
                if (this.httpErrors[code]) {
                    throw new Error(`Response Http Error - ${this.httpErrors[code]}`);
                }
            }
            throw new Error(`Unable to connect to ${this.apiUrl}. Error: ${error.message}`);
        }
    }

    /**
     * Get headers for HTTP request
     * @return {Object}
     */
    getHeaders() {
        const nodeVersion = process.version;
        const uname = `${os.type()} ${os.release()} ${os.arch()}`;
        const ua = {
            version: PayssionClient.VERSION,
            lang: 'nodejs',
            lang_version: nodeVersion,
            publisher: 'payssion',
            uname: uname
        };

        return {
            'X-Payssion-Client-User-Agent': JSON.stringify(ua),
            'User-Agent': `Payssion/nodejs/${nodeVersion}/${PayssionClient.VERSION}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        };
    }
}

module.exports = PayssionClient;