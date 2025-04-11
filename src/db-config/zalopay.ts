import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { response } from 'express';
import moment from 'moment';
import qs from 'qs';
import {v4 as uuidv4} from 'uuid';

dotenv.config();

const APP_ID = process.env.ZALOPAY_APP_ID!;
const KEY1 = process.env.ZALOPAY_KEY1!;
const KEY2 = process.env.ZALOPAY_KEY2!;
const ZALOPAY_ENDPOINT = process.env.ZALOPAY_ENDPOINT!;
const QUERY_ENDPOINT = process.env.ZALOPAY_QUERY_ENDPOINT!;

export async function createZaloPayOrder(amount: number, orderId: string) {
    const config = {
        app_id: "2553",
        key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
        key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
        endpoint: "https://sb-openapi.zalopay.vn/v2/create"
    };
    
    const embed_data = {};
    
    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
        app_user: "user123",
        app_time: Date.now(), // miliseconds
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: amount,
        description: `Lazada - Payment for the order #${transID}`,
        bank_code: "zalopayapp",
    };
    
    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    (order as any).mac = crypto.createHmac('sha256', config.key1).update(data).digest('hex');
    
    const response = await axios.post(config.endpoint, null, { params: order })
    

    return { response: response.data, app_trans_id: order.app_trans_id};
}

export const checkZaloPayStatus = async (app_trans_id: string) => {
    const config = {
        app_id: "2553",
        key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
        key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
        endpoint: "https://sb-openapi.zalopay.vn/v2/query"
    };

    let postData = {
        app_id: config.app_id,
        app_trans_id: app_trans_id,
        mac: ''
    }

    let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1;
    postData.mac = crypto.createHmac('sha256', config.key1).update(data).digest('hex');

    let postConfig = {
        method: 'post',
        url: config.endpoint,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(postData)
    };

    const response = await axios(postConfig);
    // console.log(response);
    return { response: response };
};
